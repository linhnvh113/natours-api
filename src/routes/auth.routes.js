'use strict';

const express = require('express');
const authController = require('../controllers/auth.controller');

const authRouter = express.Router();

authRouter.post('/sign-up', authController.httpSignUp);
authRouter.post('/sign-in', authController.httpSignIn);
authRouter.post('/forgot-password', authController.httpForgotPassword);
authRouter.patch(
  '/reset-password/:resetToken',
  authController.httpResetPassword,
);

module.exports = authRouter;
