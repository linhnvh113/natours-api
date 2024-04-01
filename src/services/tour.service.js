'use strict';

const Tour = require('../models/tour.model');
const AppError = require('../utils/app-error');
const { ITEMS_PER_PAGE } = require('../constants');
const { convertAdvancedQuery, calcTotalPages } = require('../utils');

exports.getAllTours = async ({
  page = 1,
  itemsPerPage = ITEMS_PER_PAGE,
  name,
  ...query
}) => {
  const skip = (page - 1) * itemsPerPage;
  const nameReg = new RegExp(name);
  const queryString = convertAdvancedQuery(query);

  const [items, totalItems] = await Promise.all([
    Tour.find({ name: { $regex: nameReg }, ...queryString })
      .skip(skip)
      .limit(itemsPerPage),
    Tour.countDocuments(),
  ]);

  const totalPages = calcTotalPages(totalItems, itemsPerPage);

  return {
    currentItemCount: items.length,
    itemsPerPage,
    totalItems,
    totalPages,
    items,
  };
};

exports.getTourById = async (_id) => {
  const tour = await Tour.findById(_id).populate('reviews');
  if (!tour) {
    throw new AppError('No tour found with that ID', 404);
  }

  return tour;
};

exports.createTour = async (body) => {
  const newTour = await Tour.create(body);
  return newTour;
};

exports.updateTour = async (_id, body) => {
  const updatedTour = await Tour.findByIdAndUpdate(_id, body, {
    new: true,
    runValidators: true,
  });
  if (!updatedTour) {
    throw new AppError('No tour found with that ID', 404);
  }

  return updatedTour;
};

exports.deleteTour = async (_id) => {
  const deletedTour = await Tour.findByIdAndDelete(_id);
  if (!deletedTour) {
    throw new AppError('No tour found with that ID', 404);
  }

  return deletedTour;
};
