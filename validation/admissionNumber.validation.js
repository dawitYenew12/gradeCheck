const joi = require('joi');
const admissionNumValidate = require('./custom.validation.js');

const getGradeValidationSchema = {
  params: joi.object({
    admissionNo: joi.string().custom(admissionNumValidate).required(),
  }),
};

module.exports = getGradeValidationSchema;
