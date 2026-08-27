const request = require("supertest");
const bcrypt = require("bcryptjs");

const app = require("../src/app");
const User = require("../src/models/User");
const Gig = require("../src/models/Gig");
const Booking = require("../src/models/Booking");
const Transaction = require("../src/models/Transaction");

describe("Marketplace API", () => {
    let clientToken;
    let freelancerToken;
    let otherFreelancerToken;

    let clientUser;
    let freelancerUser;
    let otherFreelancerUser;

    let gigId;

    const password = "SecurePass123!";

    beforeAll(async () => {
        const passwordHash = await bcrypt.hash(password, 12);

        clientUser = await User.create({
            name: "Marketplace Client",
            email: `client-${Date.now()}@example.com`,
            passwordHash,
            role: "client"
        });

        freelancerUser = await User.create({
            name: "Marketplace Freelancer",
            email: `freelancer-${Date.now()}@example.com`,
            passwordHash,
            role: "freelancer"
        });

        otherFreelancerUser = await User.create({
            name: "Other Freelancer",
            email: `other-${Date.now()}@example.com`,
            passwordHash,
            role: "freelancer"
        });

        const clientLogin = await request(app)
            .post("/api/auth/login")
            .send({
                email: clientUser.email,
                password
            });

        const freelancerLogin = await request(app)
            .post("/api/auth/login")
            .send({
                email: freelancerUser.email,
                password
            });

        const otherFreelancerLogin = await request(app)
            .post("/api/auth/login")
            .send({
                email: otherFreelancerUser.email,
                password
            });

        clientToken = clientLogin.body.token;
        freelancerToken = freelancerLogin.body.token;
        otherFreelancerToken = otherFreelancerLogin.body.token;
    });

    afterAll(async () => {
        await Transaction.deleteMany({
            $or: [
                { client: clientUser._id },
                { freelancer: freelancerUser._id },
                { freelancer: otherFreelancerUser._id }
            ]
        });

        await Booking.deleteMany({
            $or: [
                { client: clientUser._id },
                { freelancer: freelancerUser._id },
                { freelancer: otherFreelancerUser._id }
            ]
        });

        await Gig.deleteMany({
            freelancer: {
                $in: [
                    freelancerUser._id,
                    otherFreelancerUser._id
                ]
            }
        });

        await User.deleteMany({
            _id: {
                $in: [
                    clientUser._id,
                    freelancerUser._id,
                    otherFreelancerUser._id
                ]
            }
        });
    });

    test("Freelancer should create a gig", async () => {
        const response = await request(app)
            .post("/api/gigs")
            .set("Authorization", `Bearer ${freelancerToken}`)
            .send({
                title: "Automated Test Gig",
                description: "This gig is created by the automated marketplace tests.",
                category: "Testing",
                price: 1200
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.gig.title).toBe("Automated Test Gig");

        gigId = response.body.gig._id;
    });

    test("Client should not create a gig", async () => {
        const response = await request(app)
            .post("/api/gigs")
            .set("Authorization", `Bearer ${clientToken}`)
            .send({
                title: "Invalid Client Gig",
                description: "A client should not be allowed to create this gig.",
                category: "Testing",
                price: 500
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });

    test("Freelancer should view their own gigs", async () => {
        const response = await request(app)
            .get("/api/gigs/mine")
            .set("Authorization", `Bearer ${freelancerToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

        const gig = response.body.gigs.find(
            (item) => item._id === gigId
        );

        expect(gig).toBeDefined();
    });

    test("Authenticated client should browse active gigs", async () => {
        const response = await request(app)
            .get("/api/gigs")
            .set("Authorization", `Bearer ${clientToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

        const gig = response.body.gigs.find(
            (item) => item._id === gigId
        );

        expect(gig).toBeDefined();
    });

    test("Freelancer should update their own gig", async () => {
        const response = await request(app)
            .put(`/api/gigs/${gigId}`)
            .set("Authorization", `Bearer ${freelancerToken}`)
            .send({
                price: 1500
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.gig.price).toBe(1500);
    });

    test("Another freelancer should not update someone else's gig", async () => {
        const response = await request(app)
            .put(`/api/gigs/${gigId}`)
            .set("Authorization", `Bearer ${otherFreelancerToken}`)
            .send({
                price: 9999
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });

    test("Client should book a gig", async () => {
        const response = await request(app)
            .post("/api/bookings")
            .set("Authorization", `Bearer ${clientToken}`)
            .send({
                gigId
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.booking.price).toBe(1500);
        expect(response.body.transaction.amount).toBe(1500);
    });

    test("Freelancer should not book a gig", async () => {
        const response = await request(app)
            .post("/api/bookings")
            .set("Authorization", `Bearer ${freelancerToken}`)
            .send({
                gigId
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });

    test("Client should view their own bookings", async () => {
        const response = await request(app)
            .get("/api/bookings/mine")
            .set("Authorization", `Bearer ${clientToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.count).toBeGreaterThanOrEqual(1);
    });

    test("Freelancer should view bookings for their gigs", async () => {
        const response = await request(app)
            .get("/api/bookings/freelancer")
            .set("Authorization", `Bearer ${freelancerToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.count).toBeGreaterThanOrEqual(1);
    });

    test("Freelancer income should include completed transaction", async () => {
        const response = await request(app)
            .get("/api/bookings/income")
            .set("Authorization", `Bearer ${freelancerToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.totalIncome).toBeGreaterThanOrEqual(1500);
        expect(response.body.transactionCount).toBeGreaterThanOrEqual(1);
    });

    test("Client should not access freelancer income", async () => {
        const response = await request(app)
            .get("/api/bookings/income")
            .set("Authorization", `Bearer ${clientToken}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });
});