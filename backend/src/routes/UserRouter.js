const express = require('express');
const { CreateUser, LoginUser } = require('../controllers/UserController');
const userRouter = express.Router();

userRouter.post('/create-user', CreateUser);
userRouter.post('/login-user', LoginUser);
module.exports = { userRouter };