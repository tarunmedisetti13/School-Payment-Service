const mongoose = require("mongoose");

const webhookLogSchema = new mongoose.Schema(
    {
        event: {
            type: String,
            required: true, // e.g., "payment.success" / "payment.failed"
        },
        payload: {
            type: Object,
            required: true, // store the entire raw webhook JSON
        },
        status: {
            type: Number, // webhook response status, e.g., 200
        },
        receivedAt: {
            type: Date,
            default: Date.now, // when webhook was received
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("WebhookLog", webhookLogSchema);
