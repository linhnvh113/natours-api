'use strict';

const jwt = require('jsonwebtoken');

exports.catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

exports.signJWTToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30m',
  });
};

exports.convertAdvancedQuery = (query) => {
  const queryString = JSON.stringify(query);
  return JSON.parse(
    queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`),
  );
};

exports.calcTotalPages = (totalItems, itemsPerPage) => {
  return Math.ceil(totalItems / itemsPerPage);
};
