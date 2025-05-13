const winston = require('winston');
const { format, createLogger, transports } = winston;
const { combine, timestamp, printf, colorize } = format;
const config = require('../config/config');

const winstonFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp}: ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp(),
    config.env === 'production'
      ? winstonFormat
      : combine(colorize(), winstonFormat),
  ),
  transports: [new transports.Console()],
});

module.exports = logger;
