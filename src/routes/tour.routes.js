'use strict';

const express = require('express');

const tourController = require('../controllers/tour.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const reviewRouter = require('../routes/review.routes');

const tourRouter = express.Router();

tourRouter.use('/:tourId/reviews', reviewRouter);

tourRouter
  .route('/')
  .get(tourController.httpGetAllTours)
  .post(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    tourController.httpCreateTour,
  );

tourRouter
  .route('/:_id')
  .get(tourController.httpGetTourById)
  .patch(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    tourController.httpUpdateTour,
  )
  .delete(
    authMiddleware.protect,
    authMiddleware.restrictTo('admin'),
    tourController.httpDeleteTour,
  );

module.exports = tourRouter;
