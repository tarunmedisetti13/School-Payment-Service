const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ success: false, message: "no token provided" });
        }
        const token = authHeader.split(" ")[1];

        //verify
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ success: false, message: "Token is invalid or expired" });
            }
            req.user = decoded;
            next();
        });

    } catch (error) {
        console.error("Auth Middleware Error:", error);
        res.status(500).json({ success: false, message: "Authentication failed" });
    }
}

module.exports = authMiddleware;