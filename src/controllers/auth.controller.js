'use strict';

const authService = require('../services/auth.service');
const { catchAsync } = require('../utils');

exports.httpSignUp = catchAsync(async (req, res, next) => {
  return res.status(201).json({
    status: 'success',
    data: await authService.signUp(req.body),
  });
});

exports.httpSignIn = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    data: await authService.signIn(req.body),
  });
});

exports.httpForgotPassword = catchAsync(async (req, res, next) => {
  await authService.forgotPassword(req.body);

  return res.status(200).json({
    status: 'success',
    message: 'Reset token was sent to email!',
  });
});

exports.httpResetPassword = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    data: await authService.resetPassword(req.params.resetToken, req.body),
  });
});
