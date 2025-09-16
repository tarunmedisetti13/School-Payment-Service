const mongoose = require("mongoose");

const orderStatusSchema = new mongoose.Schema(
    {
        collect_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order", // Links to Order (_id)
            required: true,
        },
        order_amount: {
            type: Number,
            required: true,
        },
        transaction_amount: {
            type: Number,
            required: true,
        },
        payment_mode: {
            type: String,
            enum: ["upi", "card", "netbanking", "wallet", "cash"],
            required: true,
        },
        payment_details: {
            type: String, // e.g., UPI ID, Card last4, etc.
        },
        bank_reference: {
            type: String,
        },
        payment_message: {
            type: String,
        },
        status: {
            type: String,
            enum: ["SUCCESS", "FAILED", "PENDING"],
            required: true,
        },
        error_message: {
            type: String,
            default: "NA",
        },
        payment_time: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("OrderStatus", orderStatusSchema);
