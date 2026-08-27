const Gig = require("../models/Gig");

// Create a new gig
async function createGig(req, res, next) {
    try {
        const gig = await Gig.create({
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            price: req.body.price,
            freelancer: req.user.sub
        });

        return res.status(201).json({
            success: true,
            message: "Gig created successfully.",
            gig
        });
    } catch (error) {
        next(error);
    }
}

// Get all active gigs for browsing
async function getAllGigs(req, res, next) {
    try {
        const gigs = await Gig.find({
            isActive: true
        })
            .populate("freelancer", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: gigs.length,
            gigs
        });
    } catch (error) {
        next(error);
    }
}

// Get gigs owned by the logged-in freelancer
async function getMyGigs(req, res, next) {
    try {
        const gigs = await Gig.find({
            freelancer: req.user.sub
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: gigs.length,
            gigs
        });
    } catch (error) {
        next(error);
    }
}

// Get one gig by ID
async function getGigById(req, res, next) {
    try {
        const gig = await Gig.findById(req.params.id)
            .populate("freelancer", "name email");

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found."
            });
        }

        return res.status(200).json({
            success: true,
            gig
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid gig ID."
            });
        }

        next(error);
    }
}

// Update a gig owned by the logged-in freelancer
async function updateGig(req, res, next) {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found."
            });
        }

        if (gig.freelancer.toString() !== req.user.sub) {
            return res.status(403).json({
                success: false,
                message: "You can only update your own gigs."
            });
        }

        const allowedFields = [
            "title",
            "description",
            "category",
            "price",
            "isActive"
        ];

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                gig[field] = req.body[field];
            }
        }

        await gig.save();

        return res.status(200).json({
            success: true,
            message: "Gig updated successfully.",
            gig
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid gig ID."
            });
        }

        next(error);
    }
}

// Delete a gig owned by the logged-in freelancer
async function deleteGig(req, res, next) {
    try {
        const gig = await Gig.findById(req.params.id);

        if (!gig) {
            return res.status(404).json({
                success: false,
                message: "Gig not found."
            });
        }

        if (gig.freelancer.toString() !== req.user.sub) {
            return res.status(403).json({
                success: false,
                message: "You can only delete your own gigs."
            });
        }

        await gig.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Gig deleted successfully."
        });
    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid gig ID."
            });
        }

        next(error);
    }
}

module.exports = {
    createGig,
    getAllGigs,
    getMyGigs,
    getGigById,
    updateGig,
    deleteGig
};