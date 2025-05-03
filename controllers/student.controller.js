const { getGradeByAdmission } = require('../services/grade.service');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const logger = require('../utils/logger');

const getGrade = catchAsync(async (req, res) => {
  const admissionNumber = req.params.admissionNo;
  const grades = await getGradeByAdmission(admissionNumber);
  res.status(httpStatus.OK).json({ success: true, grades });
});

module.exports = getGrade;
