const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        school_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "School", // Reference to School
            required: true,
        },
        trustee_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // Trustee is also a User
            required: true,
        },
        student_info: {
            name: { type: String, required: true },
            id: { type: String, required: true }, // custom student ID (not Mongo _id)
            email: { type: String, required: true },
        },
        gateway_name: {
            type: String,
            required: true, // e.g., PhonePe, Razorpay, Stripe
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
