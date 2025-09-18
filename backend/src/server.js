const { userRouter } = require('./routes/UserRouter');
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authMiddleware = require('./middleware/authMiddleware');
const { paymentRouter } = require('./routes/PaymentRouter')
dotenv.config();
const app = express();

const allowedOrigins = process.env.CORS_ORIGIN.split(",");
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

// Middlewares
app.use(express.json());

//enable cors to handle incoming requests
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

//routes

app.use('/api/user', userRouter);
app.use("/api/payments", authMiddleware, paymentRouter);

// DB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error(err));

// Basic Route
app.get("/", (req, res) => {
    res.send("School Payment Service API running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
