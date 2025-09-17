const jwt = require("jsonwebtoken");
const axios = require("axios");
const Order = require("../models/OrderModel"); // make sure path is correct
const OrderStatus = require("../models/OrderStatusModel");
const WebhookLog = require('../models/WebhookModel');
const dotenv = require("dotenv");
const mongoose = require('mongoose');
dotenv.config();
const ObjectId = mongoose.Types.ObjectId;
const PG_API_KEY = process.env.PG_API_KEY;
const PG_SECRET_KEY = process.env.PG_SECRET_KEY;

// ✅ Create Payment
exports.createPayment = async (req, res) => {
    try {
        const { school_id, amount, callback_url, student_info, trustee_id, gateway_name } = req.body;
        // At the beginning
        if (!school_id || !amount || !student_info) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }
        // 1. Generate sign (JWT)
        const payload = { school_id, amount, callback_url };
        //console.log(PG_SECRET_KEY);
        const sign = jwt.sign(payload, PG_SECRET_KEY, { algorithm: "HS256" });
        //console.log(sign)
        // 2. Call PG API
        const response = await axios.post(
            "https://dev-vanilla.edviron.com/erp/create-collect-request",
            { school_id, amount, callback_url, sign },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${PG_API_KEY}`,
                },
            }
        );

        // 3. Save in DB
        const order = await Order.create({
            school_id,
            trustee_id,
            student_info,
            gateway_name,
        });

        await OrderStatus.create({
            collect_id: order._id,         // reference to Order
            order_amount: amount,          // original amount from request
            transaction_amount: 0,         // initially 0, updated by webhook
            payment_mode: "upi",              // empty initially, updated by webhook
            payment_details: "",
            bank_reference: "",
            payment_message: "Payment link generated",
            status: "PENDING",
            error_message: "NA",
            payment_time: Date.now(),
        });

        res.json({
            success: true,
            data: response.data,
            orderId: order._id,
        });
    } catch (err) {
        console.error("Payment creation error:", err.response?.data || err.message);
        res.status(500).json({
            success: false,
            message: "Failed to create payment",
        });
    }
};


// Check Payment Status
exports.checkPaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params; // get orderId from query

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: "orderId is required",
            });
        }
        // 1. Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // 2. Get the latest OrderStatus
        const latestStatus = await OrderStatus.findOne({ collect_id: order._id })
            .sort({ createdAt: -1 }); // latest first

        res.json({
            success: true,
            order,
            status: latestStatus || "No status available yet",
        });
    } catch (err) {
        console.error("Check payment status error:", err.message);
        res.status(500).json({
            success: false,
            message: "Failed to check payment status",
        });
    }
};

exports.webhookUpdate = async (req, res) => {
    try {
        // 1. Store raw webhook in WebhookLog
        await WebhookLog.create({
            event: req.body.event || "payment.update",
            payload: req.body,
            status: 200
        });

        // 2. Extract payment data (adjust based on PG payload format)
        const payload = req.body.order_info || req.body; // handle both cases
        const {
            order_id,          // collect_id from PG (maps to Order._id)
            order_amount,
            transaction_amount,
            payment_mode,
            payment_details,
            bank_reference,
            payment_message,
            status,
            error_message,
            payment_time,
        } = payload;

        // 3. Find related order
        const order = await Order.findById(order_id);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // 4. Update or insert OrderStatus
        const orderStatus = await OrderStatus.findOneAndUpdate(
            { collect_id: order._id },
            {
                order_amount,
                transaction_amount,
                payment_mode: (payment_mode || "upi").toLowerCase(),
                payment_details,
                bank_reference,
                payment_message,
                status: status?.toUpperCase() || "PENDING",
                error_message: error_message || "NA",
                payment_time: payment_time ? new Date(payment_time) : Date.now(),
            },
            { new: true, upsert: true }
        );

        // 5. Respond back to PG
        res.json({ success: true, message: "Order status updated", orderStatus });
    } catch (err) {
        console.error("Webhook error:", err.message);
        res.status(500).json({ success: false, message: "Failed to update order status" });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            status,
            schoolId,
            date,
            sortBy = "createdAt",
            order = "desc",
        } = req.query;

        const match = {};

        if (status) {
            match.status = { $in: status.split(",").map(s => s.toUpperCase()) };
        }

        if (schoolId) {
            match["order_info.school_id"] = {
                $in: schoolId.split(",").map(id => new mongoose.Types.ObjectId(id))
            };
        }

        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0); // start of day
            const end = new Date(date);
            end.setHours(23, 59, 59, 999); // end of day

            match.payment_time = { $gte: start, $lte: end };
        }
        const sortOrder = order === "asc" ? 1 : -1;

        const pipeline = [
            {
                $lookup: {
                    from: "orders",
                    localField: "collect_id",
                    foreignField: "_id",
                    as: "order_info",
                },
            },
            { $unwind: "$order_info" },
            { $match: match },
            {
                $project: {
                    collect_id: "$_id",
                    school_id: "$order_info.school_id",
                    gateway: "$order_info.gateway_name",
                    order_amount: 1,
                    transaction_amount: 1,
                    status: 1,
                    createdAt: 1,
                    custom_order_id: "$order_info.student_info.id",
                },
            },
            { $sort: { [sortBy]: sortOrder } },
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [
                        { $skip: (parseInt(page) - 1) * parseInt(limit) },
                        { $limit: parseInt(limit) },
                    ],
                },
            },
        ];

        const result = await OrderStatus.aggregate(pipeline);

        const transactions = result[0].data || [];
        const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;

        res.json({
            success: true,
            data: transactions,
            total,
            page: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (err) {
        console.error("Error fetching transactions:", err);
        res.status(500).json({ success: false, message: "Failed to fetch transactions" });
    }
};


exports.getTransactionsBySchool = async (req, res) => {
    try {
        const { schoolId } = req.params;
        const { page = 1, limit = 10, sortBy = "payment_time", order = "desc" } = req.query;

        // Validate schoolId
        if (!mongoose.Types.ObjectId.isValid(schoolId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid schoolId. Must be a valid MongoDB ObjectId."
            });
        }

        const matchConditions = {
            "order_info.school_id": new mongoose.Types.ObjectId(schoolId)
        };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Allowed sorting fields
        const sortFields = {
            createdAt: "payment_time",
            order_amount: "order_amount",
            transaction_amount: "transaction_amount",
            status: "status"
        };
        const sortField = sortFields[sortBy] || "payment_time";
        const sortOrder = order === "asc" ? 1 : -1;

        // Fetch transactions
        const transactions = await OrderStatus.aggregate([
            {
                $lookup: {
                    from: "orders",
                    localField: "collect_id",
                    foreignField: "_id",
                    as: "order_info"
                }
            },
            { $unwind: "$order_info" },
            { $match: matchConditions },
            {
                $project: {
                    collect_id: "$_id",
                    school_id: "$order_info.school_id",
                    gateway: "$order_info.gateway_name",
                    order_amount: 1,
                    transaction_amount: 1,
                    status: 1,
                    payment_mode: 1,
                    payment_time: 1,
                    custom_order_id: "$order_info.student_info.id"
                }
            },
            { $sort: { [sortField]: sortOrder } },
            { $skip: skip },
            { $limit: parseInt(limit) }
        ]);

        // Total count
        const totalCount = await OrderStatus.aggregate([
            {
                $lookup: {
                    from: "orders",
                    localField: "collect_id",
                    foreignField: "_id",
                    as: "order_info"
                }
            },
            { $unwind: "$order_info" },
            { $match: matchConditions },
            { $count: "count" }
        ]);

        res.json({
            success: true,
            total: totalCount.length ? totalCount[0].count : 0,
            page: parseInt(page),
            limit: parseInt(limit),
            data: transactions
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch transactions by school" });
    }
};

exports.getTransactionStatus = async (req, res) => {
    try {
        const { custom_order_id } = req.params;
        const transaction = await OrderStatus.aggregate([
            {
                $lookup: {
                    from: "orders",
                    localField: "collect_id",
                    foreignField: "_id",
                    as: "order_info"
                }
            },
            { $unwind: "$order_info" },
            { $match: { "order_info.student_info.id": custom_order_id } },
            {
                $project: {
                    collect_id: "$_id",
                    school_id: "$order_info.school_id",
                    gateway: "$order_info.gateway_name",
                    order_amount: 1,
                    transaction_amount: 1,
                    status: 1,
                    custom_order_id: "$order_info.student_info.id"
                }
            }
        ]);

        if (!transaction || transaction.length === 0) {
            return res.status(404).json({ success: false, message: "Transaction not found" });
        }

        res.json({ success: true, data: transaction[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch transaction status" });
    }
};

exports.getWebhookLogs = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const logs = await WebhookLog.find()
            .sort({ createdAt: -1 }) // latest first
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await WebhookLog.countDocuments();

        res.json({
            success: true,
            data: logs,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error("Error fetching webhook logs:", err.message);
        res.status(500).json({ success: false, message: "Failed to fetch webhook logs" });
    }
};

exports.getTransactionSummaryBySchool = async (req, res) => {
    try {
        const { schoolId } = req.params;

        const summary = await OrderStatus.aggregate([
            {
                $lookup: {
                    from: "orders",
                    localField: "collect_id",
                    foreignField: "_id",
                    as: "order_info"
                }
            },
            { $unwind: "$order_info" },
            { $match: { "order_info.school_id": new mongoose.Types.ObjectId(schoolId) } },
            {
                $group: {
                    _id: "$status",
                    totalAmount: { $sum: "$transaction_amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({ success: true, summary });
    } catch (err) {
        console.error("Summary API error:", err.message);
        res.status(500).json({ success: false, message: "Failed to fetch transaction summary" });
    }
};



