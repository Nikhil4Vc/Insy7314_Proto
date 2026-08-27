const express = require("express");

const {
    updateUserRole
} = require("../controllers/userController");

const {
    updateRoleValidation
} = require("../validators/userValidators");

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

router.patch(
    "/:id/role",
    authenticateToken,
    requireRole("admin"),
    updateRoleValidation,
    handleValidationErrors,
    updateUserRole
);

module.exports = router;