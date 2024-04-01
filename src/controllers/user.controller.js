'use strict';

const userService = require('../services/user.service');
const { catchAsync } = require('../utils');

exports.httpGetAllUsers = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    data: await userService.getAllUsers(req.query),
  });
});

exports.httpGetUserById = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    data: await userService.getUserById(req.params._id),
  });
});
