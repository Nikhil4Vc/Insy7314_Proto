const { body } = require("express-validator");

const createBookingValidation = [
    body("gigId")
        .trim()
        .notEmpty()
        .withMessage("Gig ID is required.")
        .isMongoId()
        .withMessage("Gig ID must be a valid MongoDB ID.")
];

module.exports = {
    createBookingValidation
};