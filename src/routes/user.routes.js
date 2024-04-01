'use strict';

const express = require('express');
const userController = require('../controllers/user.controller');

const userRouter = express.Router();

userRouter.route('/').get(userController.httpGetAllUsers);

userRouter.route('/:_id').get(userController.httpGetUserById);

module.exports = userRouter;
