'use strict';

const User = require('../models/user.model');
const { ITEMS_PER_PAGE } = require('../constants');
const { convertAdvancedQuery, calcTotalPages } = require('../utils');

exports.getAllUsers = async ({
  page = 1,
  itemsPerPage = ITEMS_PER_PAGE,
  name,
  ...query
}) => {
  const skip = (page - 1) * itemsPerPage;
  const nameReg = new RegExp(name);
  // Rename queryString
  const queryString = convertAdvancedQuery(query);

  const [items, totalItems] = await Promise.all([
    User.find({ name: { $regex: nameReg }, ...queryString })
      .skip(skip)
      .limit(itemsPerPage),
    User.countDocuments(),
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

exports.getUserById = async (_id) => {
  const user = await User.findById(_id);
  if (!user) {
    throw new AppError('No tour found with that ID', 404);
  }

  return user;
};
