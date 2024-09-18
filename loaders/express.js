const express = require('express');
const cors = require('cors');
const httpStatus = require('http-status');
const config = require('../config/confg');
const gradeRouter = require('../routes/grade.route.js');
const ApiError = require('../utils/ApiError');
const { errorHandler, errorConverter } = require('../middlewares/error');

exports.default = async (app) => {
  app.use(express.json());
  if (config.env === 'production') {
    app.use(cors({ origin: url }));
    app.options('*', cors({ origin: url }));
  } else {
    app.use(cors());
    app.options('*', cors());
  }

  app.use(gradeRouter);

  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  app.use(errorConverter);
  app.use(errorHandler);
};
