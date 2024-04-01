'use strict';

const tourService = require('../services/tour.service');
const { catchAsync } = require('../utils');

exports.httpGetAllTours = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    data: await tourService.getAllTours(req.query),
  });
});

exports.httpGetTourById = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    data: await tourService.getTourById(req.params._id),
  });
});

exports.httpCreateTour = catchAsync(async (req, res, next) => {
  return res.status(201).json({
    status: 'success',
    data: await tourService.createTour(req.body),
  });
});

exports.httpUpdateTour = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    data: await tourService.updateTour(req.params._id, req.body),
  });
});

exports.httpDeleteTour = catchAsync(async (req, res, next) => {
  return res.status(204).json({
    status: 'success',
    data: await tourService.deleteTour(req.params._id),
  });
});
