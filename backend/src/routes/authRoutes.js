const express = require("express");
const rateLimit = require("express-rate-limit");

const {
    register,
    login,
    getCurrentUser
} = require("../controllers/authController");

const {
    registerValidation,
    loginValidation
} = require("../validators/authValidators");

const {
    handleValidationErrors
} = require("../middleware/validationMiddleware");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later."
    }
});

const router = express.Router();

router.post(
    "/register",
    authLimiter,
    registerValidation,
    handleValidationErrors,
    register
);

router.post(
    "/login",
    authLimiter,
    loginValidation,
    handleValidationErrors,
    login
);

router.get(
    "/me",
    authenticateToken,
    getCurrentUser
);

module.exports = router;