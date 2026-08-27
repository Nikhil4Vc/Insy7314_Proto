const { body } = require("express-validator");

const updateRoleValidation = [
    body("role")
        .notEmpty()
        .withMessage("Role is required.")
        .isIn([
            "client",
            "freelancer",
            "admin"
        ])
        .withMessage(
            "Role must be client, freelancer or admin."
        )
];

module.exports = {
    updateRoleValidation
};