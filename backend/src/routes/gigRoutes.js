const express = require("express");

const {
    createGig,
    getAllGigs,
    getMyGigs,
    getGigById,
    updateGig,
    deleteGig
} = require("../controllers/gigController");

const {
    createGigValidation,
    updateGigValidation
} = require("../validators/gigValidators");

const {
    handleValidationErrors
} = require("../middleware/validationMiddleware");

const {
    authenticateToken
} = require("../middleware/authMiddleware");

const {
    requireRole
} = require("../middleware/roleMiddleware");

const router = express.Router();

// Public/authenticated browsing of active gigs
router.get(
    "/",
    authenticateToken,
    getAllGigs
);

// Freelancer's own gigs
router.get(
    "/mine",
    authenticateToken,
    requireRole("freelancer"),
    getMyGigs
);

// Get one gig
router.get(
    "/:id",
    authenticateToken,
    getGigById
);

// Create gig - freelancer only
router.post(
    "/",
    authenticateToken,
    requireRole("freelancer"),
    createGigValidation,
    handleValidationErrors,
    createGig
);

// Update gig - freelancer only
router.put(
    "/:id",
    authenticateToken,
    requireRole("freelancer"),
    updateGigValidation,
    handleValidationErrors,
    updateGig
);

// Delete gig - freelancer only
router.delete(
    "/:id",
    authenticateToken,
    requireRole("freelancer"),
    deleteGig
);

module.exports = router;