'use strict';

const reviewService = require('../services/review.service');
const { catchAsync } = require('../utils');

exports.httpGetAllReviews = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    data: await reviewService.getAllReviews(req.params.tourId, req.query),
  });
});

exports.httpCreateReview = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;

  return res.status(201).json({
    status: 'success',
    data: await reviewService.createReview(req.body),
  });
});
