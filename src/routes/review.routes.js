'use strict';

const express = require('express');

const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route('/')
  .get(reviewController.httpGetAllReviews)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('user'),
    reviewController.httpCreateReview,
  );

module.exports = reviewRouter;
