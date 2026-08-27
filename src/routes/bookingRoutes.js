const express = require("express");
const rateLimit = require("express-rate-limit");

const {
    createBooking,
    getMyClientBookings,
    getFreelancerBookings,
    getFreelancerIncome
} = require("../controllers/bookingController");

const {
    createBookingValidation
} = require("../validators/bookingValidators");

const {
    handleValidationErrors
} = require("../middleware/validationMiddleware");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

const {
    requireRole
} = require("../middleware/roleMiddleware");

const bookingLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many booking requests. Please try again later."
    }
});

const router = express.Router();

// Client books a gig
router.post(
    "/",
    bookingLimiter,
    authenticateToken,
    requireRole("client"),
    createBookingValidation,
    handleValidationErrors,
    createBooking
);

// Client views own bookings
router.get(
    "/mine",
    authenticateToken,
    requireRole("client"),
    getMyClientBookings
);

// Freelancer views bookings for their gigs
router.get(
    "/freelancer",
    authenticateToken,
    requireRole("freelancer"),
    getFreelancerBookings
);

// Freelancer views income
router.get(
    "/income",
    authenticateToken,
    requireRole("freelancer"),
    getFreelancerIncome
);

module.exports = router;