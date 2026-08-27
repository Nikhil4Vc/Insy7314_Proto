const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 254
        },

        passwordHash: {
            type: String,
            required: true
        },

        role: {
            type: String,
            enum: ["client", "freelancer", "admin"],
            default: "client"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);