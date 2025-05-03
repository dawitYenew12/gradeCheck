const express = require('express');
const router = express.Router();
const getGrade = require('../controllers/student.controller');
const validate = require('../middlewares/validate');
const getGradeValidationSchema = require('../validation/admissionNumber.validation');
const recentGradeCache = require('../middlewares/cache/recent-grades');

router.get(
  '/grade/:admissionNo',
  validate(getGradeValidationSchema),
  recentGradeCache,
  getGrade,
);

module.exports = router;
