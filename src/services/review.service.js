'use strict';

const Review = require('../models/review.model');
const { ITEMS_PER_PAGE } = require('../constants');
const { calcTotalPages } = require('../utils');

exports.getAllReviews = async (
  tourId,
  { page = 1, itemsPerPage = ITEMS_PER_PAGE },
) => {
  const skip = (page - 1) * itemsPerPage;

  const [items, totalItems] = await Promise.all([
    Review.find({ tour: tourId })
      .skip(skip)
      .limit(itemsPerPage)
      .sort('-createdAt'),
    Review.countDocuments(),
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

exports.createReview = async (body) => {
  const newReview = await Review.create(body);
  return newReview;
};
