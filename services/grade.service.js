const StudentInfo = require('../models/grade.model');

const getGradeByAdmission = async (admissionNo) => {
  const grades = await StudentInfo.findOne({ admissionNumber: admissionNo });
  return grades;
};

module.exports = { getGradeByAdmission };
