'use strict';

const crypto = require('crypto');

const User = require('../models/user.model');
const sendEmail = require('../utils/email');
const AppError = require('../utils/app-error');
const { signJWTToken } = require('../utils');

exports.signUp = async (body) => {
  const { name, email, password, passwordConfirm } = body;
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });
  const accessToken = signJWTToken({ id: newUser._id });

  return {
    accessToken,
    user: newUser,
  };
};

exports.signIn = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError('Please provide email and password!', 400);
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  const accessToken = signJWTToken({ id: user._id });

  return {
    accessToken,
    user,
  };
};

exports.forgotPassword = async ({ email }) => {
  // 1) Get user based on POSTED email
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('There is no user with this email address.', 404);
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `http://localhost:8080/api/v1/auth/reset-password/${resetToken}`;
  const text = resetURL;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      text,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });

    throw new AppError(
      'There was an error sending the email. Try again later',
      500,
    );
  }
};

exports.resetPassword = async (resetToken, body) => {
  // 1) Get user based on the reset token
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set new password
  if (!user) {
    throw new AppError('Token is invalid or has expired', 400);
  }

  user.password = body.newPassword;
  user.passwordConfirm = body.newPasswordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user

  // 4) Log the user in, send JWT
  const accessToken = signJWTToken({ id: user._id });

  return {
    accessToken,
    user,
  };
};
