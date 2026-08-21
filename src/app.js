const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

const app = express();

const authRoutes = require("./routes/authRoutes");

// Security headers
app.use(helmet());

// Allow frontend/API communication
app.use(
    cors({
        origin: true,
        credentials: true
    })
);

// Parse JSON request bodies
app.use(express.json({ limit: "10kb" }));

// Rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});

app.use(generalLimiter);

app.use("/api/auth", authRoutes);

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "HustleHub+ API is running"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);

    res.status(500).json({
        success: false,
        message: "An internal server error occurred."
    });
});

module.exports = app;