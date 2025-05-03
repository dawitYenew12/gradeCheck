const StudentInfo = require('../models/grade.model');
const cacheProcessorQueue = require('../background-tasks/queues/cache-processor.js');
const logger = require('../utils/logger');

const getGradeByAdmission = async (admissionNo) => {
  const grades = await StudentInfo.findOne({
    admissionNumber: admissionNo,
  }).select('-datasetHash');
  await cacheProcessorQueue.add('cacheProccessorJob', { grades });
  return grades;
};

module.exports = { getGradeByAdmission };
