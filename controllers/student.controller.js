const gradeService = '../services/grade.service.js';
const httpStatus = require('http-status');
const { catchAsync } = require('../utils/catchAsync');

const getGradeByAdmission = catchAsync(async (req, res) => {
  const reqBody = req.body;
  const admissionNumber = req.query;
  const grades = gradeService(admissionNumber, reqBody);
  res.status(httpStatus.OK).json({ success: true, grades });
});

module.exports = getGradeByAdmission;
