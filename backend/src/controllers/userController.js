const User = require("../models/User");

async function updateUserRole(req, res, next) {
    try {
        const { role } = req.body;

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        if (user._id.toString() === req.user.sub) {
            return res.status(400).json({
                success: false,
                message: "You cannot change your own role."
            });
        }

        user.role = role;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "User role updated successfully.",
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID."
            });
        }

        next(error);
    }
}

module.exports = {
    updateUserRole
};