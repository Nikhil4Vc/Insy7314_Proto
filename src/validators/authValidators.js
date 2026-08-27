const { body } = require("express-validator");

const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters.")
        .matches(/^[A-Za-zÀ-ÿ\s'-]+$/)
        .withMessage("Name contains invalid characters."),

    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Please provide a valid email address.")
        .isLength({ max: 254 })
        .withMessage("Email address is too long."),

    body("password")
        .isString()
        .withMessage("Password must be a string.")
        .isLength({ min: 8, max: 128 })
        .withMessage("Password must be between 8 and 128 characters.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter.")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter.")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one number.")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain at least one special character."),

    body("role")
        .optional()
        .isIn(["client", "freelancer"])
        .withMessage("Role must be either client or freelancer.")
];

const loginValidation = [
    body("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Please provide a valid email address."),

    body("password")
        .isString()
        .notEmpty()
        .withMessage("Password is required.")
];

module.exports = {
    registerValidation,
    loginValidation
};