const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const {
    findUserByEmail,
    findUserById,
    createUser
} = require("../models/userModel");

const {
    jwtSecret,
    jwtExpiresIn
} = require("../config/env");

// Register
async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        const existingUser = findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const user = {
            id: crypto.randomUUID(),
            name,
            email: email.toLowerCase(),
            passwordHash,
            role: "client",
            createdAt: new Date().toISOString()
        };

        createUser(user);

        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
}

// Login
async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.passwordHash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
    {
        sub: user.id,
        email: user.email,
        role: user.role
    },
    jwtSecret,
    {
        expiresIn: jwtExpiresIn
    }
);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
}

// Gets current user
function getCurrentUser(req, res, next) {
    try {
        const user = findUserById(req.user.sub);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User account not found."
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register,
    login,
    getCurrentUser
};