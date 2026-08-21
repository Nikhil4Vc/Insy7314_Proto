const request = require("supertest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = require("../src/app");

const {
    jwtSecret
} = require("../src/config/env");

describe("Authentication API", () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = "SecurePass123!";
    let authToken;

    test("POST /api/auth/register should create a new account", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Test User",
                email: testEmail,
                password: testPassword
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(
            "Account created successfully."
        );

        expect(response.body.user).toHaveProperty("id");
        expect(response.body.user.email).toBe(testEmail);
        expect(response.body.user.role).toBe("client");

        expect(response.body.user).not.toHaveProperty("password");
        expect(response.body.user).not.toHaveProperty("passwordHash");
    });

    test("POST /api/auth/register should reject duplicate email", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Another User",
                email: testEmail,
                password: testPassword
            });

        expect(response.statusCode).toBe(409);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "An account with this email already exists."
        );
    });

    test("POST /api/auth/register should reject a weak password", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Weak Password User",
                email: `weak-${Date.now()}@example.com`,
                password: "123"
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);
    });

    test("POST /api/auth/login should authenticate a valid user", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: testEmail,
                password: testPassword
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe("Login successful.");

        expect(response.body).toHaveProperty("token");
        expect(response.body.user.email).toBe(testEmail);

        authToken = response.body.token;
    });

    test("POST /api/auth/login should reject an incorrect password", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: testEmail,
                password: "WrongPassword123!"
            });

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Invalid email or password."
        );
    });

    test("GET /api/auth/me should reject requests without a token", async () => {
        const response = await request(app)
            .get("/api/auth/me");

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Authentication token is required."
        );
    });

    test("GET /api/auth/me should reject an invalid token", async () => {
        const response = await request(app)
            .get("/api/auth/me")
            .set("Authorization", "Bearer invalid.token.here");

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Invalid authentication token."
        );
    });

    test("GET /api/auth/me should accept a valid token", async () => {
        const response = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${authToken}`);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);
        expect(response.body.user.email).toBe(testEmail);
        expect(response.body.user.role).toBe("client");
    });

    test("JWT should contain the user's ID, email and role", async () => {
        const decoded = jwt.verify(authToken, jwtSecret);

        expect(decoded).toHaveProperty("sub");
        expect(decoded).toHaveProperty("email", testEmail);
        expect(decoded).toHaveProperty("role", "client");
    });

    test("Stored password should be bcrypt hashed", async () => {
        const {
            findUserByEmail
        } = require("../src/models/userModel");

        const user = findUserByEmail(testEmail);

        expect(user).toBeDefined();
        expect(user.passwordHash).toBeDefined();
        expect(user.passwordHash).not.toBe(testPassword);

        const passwordMatches = await bcrypt.compare(
            testPassword,
            user.passwordHash
        );

        expect(passwordMatches).toBe(true);
    });

    test("POST /api/auth/register should reject missing required fields", async () => {
        const response = await request(app)
            .post("/api/auth/register")
            .send({
                email: `missing-${Date.now()}@example.com`
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation failed.");

        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: "name"
                }),
                expect.objectContaining({
                    field: "password"
                })
            ])
        );
    });

    test("POST /api/auth/login should reject an invalid email address", async () => {
        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: "not-an-email",
                password: testPassword
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation failed.");

        expect(response.body.errors).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: "email"
                })
            ])
        );
    });

    test("GET /api/auth/me should reject a malformed authorization header", async () => {
        const response = await request(app)
            .get("/api/auth/me")
            .set("Authorization", "InvalidFormat");

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Authentication token is required."
        );
    });

    test("GET /api/auth/me should reject an expired JWT", async () => {
        const expiredToken = jwt.sign(
            {
                sub: "expired-user-id",
                email: "expired@example.com",
                role: "client"
            },
            jwtSecret,
            {
                expiresIn: -1
            }
        );

        const response = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${expiredToken}`);

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Authentication token has expired."
        );
    });

    test("GET /api/auth/me should reject an empty bearer token", async () => {
        const response = await request(app)
            .get("/api/auth/me")
            .set("Authorization", "Bearer ");

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);
    });
});