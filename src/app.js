'use strict';

const express = require('express');
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use(mongoSanitize());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour!',
});

app.use('/api', limiter);

// Routes

// Handling errors
app.all('*', (req, res, next) => {
  next(new AppError('Can not find this router on server!', 404));
});

app.use((err, req, res, next) => {
  console.log(err.stack);

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

module.exports = app;
