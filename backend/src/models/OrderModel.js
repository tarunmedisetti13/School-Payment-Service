const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        school_id: {
            type: mongoose.Schema.Types.ObjectId, // or String if external system
            required: true,
        },
        trustee_id: {
            type: mongoose.Schema.Types.ObjectId, // or String if external system
            required: true,
        },
        student_info: {
            name: { type: String, required: true },
            id: { type: String, required: true }, // could be ObjectId if you store students separately
            email: { type: String, required: true },
        },
        gateway_name: {
            type: String,
            enum: ["RAZORPAY", "PAYTM", "STRIPE", "PAYPAL", "CASH"], // restrict to known gateways
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        currency: {
            type: String,
            default: "INR", // you can keep multi-currency support
        },
        order_status: {
            type: String,
            enum: ["PENDING", "SUCCESS", "FAILED", "CANCELLED"],
            default: "PENDING",
        },
        transaction_id: {
            type: String, // link to transaction
            required: false,
        },
        payment_date: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
