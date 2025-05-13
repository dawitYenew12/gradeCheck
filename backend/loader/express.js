const express = require('express');
const cors = require('cors');
const httpStatus = require('http-status');
const config = require('../config/config');
const gradeRouter = require('../routes/grade.route.js');
const adminRouter = require('../routes/admin.route.js');
const ApiError = require('../utils/ApiError');
const { errorHandler, errorConverter } = require('../middlewares/error');
const logger = require('../utils/logger');

module.exports = async (app) => {
  app.use(express.json());

  if (config.env === 'production') {
    app.use(cors({ origin: url }));
    app.options('*', cors({ origin: url }));
  } else {
    app.use(cors());
    app.options('*', cors());
  }

  app.use('/stud', gradeRouter);
  app.use('/admin', adminRouter);

  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
  });

  app.use(errorConverter);
  app.use(errorHandler);
};
