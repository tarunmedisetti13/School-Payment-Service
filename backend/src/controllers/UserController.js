const { User } = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ✅ Create User
const CreateUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                error: "Bad Request",
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(409).json({
                error: "Conflict",
                message: "User already exists, please try logging in",
            });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user
        const user = new User({ username, email, password: hashedPassword });
        const newUser = await user.save();

        // exclude password
        const { password: _, ...userWithoutPassword } = newUser.toObject();

        // generate token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(201).json({
            message: "User Created Successfully",
            user: userWithoutPassword,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message,
            message: "Failed to create user",
        });
    }
};

// ✅ Login User
const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Bad Request",
                message: "All fields are required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                error: "Not Found",
                message: "User does not exist, please sign up",
            });
        }

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                error: "Unauthorized",
                message: "Invalid Password",
            });
        }

        // exclude password
        const { password: _, ...userWithoutPassword } = user.toObject();

        // generate token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            message: "User Login Successfully",
            user: userWithoutPassword,
            token,
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            message: "Failed to login user",
        });
    }
};

module.exports = { CreateUser, LoginUser };
