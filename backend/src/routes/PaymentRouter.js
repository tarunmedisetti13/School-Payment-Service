const express = require("express");
const { createPayment, checkPaymentStatus, webhookUpdate, getWebhookLogs,
    getAllTransactions, getTransactionStatus, getTransactionsBySchool, getTransactionSummaryBySchool } = require("../controllers/PaymentController");

const paymentRouter = express.Router();


paymentRouter.post("/create-payment", createPayment);
paymentRouter.get("/payment-status/:orderId", checkPaymentStatus);
paymentRouter.post("/webhook", webhookUpdate);
paymentRouter.get("/webhooks/logs", getWebhookLogs);
paymentRouter.get("/transactions", getAllTransactions);
paymentRouter.get("/transactions-school/:schoolId", getTransactionsBySchool);
paymentRouter.get("/transaction-status/:custom_order_id", getTransactionStatus);
paymentRouter.get("/transactions/summary/:schoolId", getTransactionSummaryBySchool);

module.exports = { paymentRouter };
