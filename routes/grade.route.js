const express = require('express');
const router = express.Router();
const getGrade = require('../controllers/student.controller');
const validate = require('../middlewares/validate');
const getGradeValidationSchema = require('../validation/admissionNumber.validation');

router.get('/grade/:admissionNo', validate(getGradeValidationSchema), getGrade);

module.exports = router;
