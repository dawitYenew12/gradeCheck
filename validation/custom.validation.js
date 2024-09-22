const logger = require('../utils/logger');

const admissioNumValidate = (value, helpers) => {
  if (value.length !== 6 || !value.match(/^[a-zA-Z0-9]{6}$/)) {
    return helpers.message('"{{#label}}" must be valid admission number');
  }
  return value;
};

module.exports = admissioNumValidate;
