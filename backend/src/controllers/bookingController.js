const Booking = require("../models/Booking");
const Transaction = require("../models/Transaction");
const Gig = require("../models/Gig");
const mongoose = require("mongoose");

// Client books an active gig
async function createBooking(req, res, next) {
    const session = await mongoose.startSession();

    try {
        const { gigId } = req.body;

        let createdBooking;
        let createdTransaction;

        await session.withTransaction(async () => {
            const gig = await Gig.findById(gigId).session(session);

            if (!gig) {
                const error = new Error("Gig not found.");
                error.statusCode = 404;
                throw error;
            }

            if (!gig.isActive) {
                const error = new Error(
                    "This gig is not currently available for booking."
                );
                error.statusCode = 400;
                throw error;
            }

            if (gig.freelancer.toString() === req.user.sub) {
                const error = new Error(
                    "You cannot book your own gig."
                );
                error.statusCode = 400;
                throw error;
            }

            createdBooking = new Booking({
                gig: gig._id,
                client: req.user.sub,
                freelancer: gig.freelancer,
                price: gig.price
            });

            await createdBooking.save({ session });

            createdTransaction = new Transaction({
                booking: createdBooking._id,
                client: req.user.sub,
                freelancer: gig.freelancer,
                amount: gig.price
            });

            await createdTransaction.save({ session });
        });

        return res.status(201).json({
            success: true,
            message: "Gig booked successfully.",
            booking: createdBooking,
            transaction: createdTransaction
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }

        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid gig ID."
            });
        }

        next(error);
    } finally {
        await session.endSession();
    }
}

// Client views their own bookings
async function getMyClientBookings(req, res, next) {
    try {
        const bookings = await Booking.find({
            client: req.user.sub
        })
            .populate("gig", "title category")
            .populate("freelancer", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        next(error);
    }
}

// Freelancer views bookings made against their gigs
async function getFreelancerBookings(req, res, next) {
    try {
        const bookings = await Booking.find({
            freelancer: req.user.sub
        })
            .populate("gig", "title category")
            .populate("client", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        next(error);
    }
}

// Freelancer views income from completed simulated transactions
async function getFreelancerIncome(req, res, next) {
    try {
        const transactions = await Transaction.find({
            freelancer: req.user.sub,
            status: "completed"
        })
            .populate("booking")
            .sort({ createdAt: -1 });

        const totalIncome = transactions.reduce(
            (total, transaction) => total + transaction.amount,
            0
        );

        return res.status(200).json({
            success: true,
            totalIncome,
            transactionCount: transactions.length,
            transactions
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createBooking,
    getMyClientBookings,
    getFreelancerBookings,
    getFreelancerIncome
};