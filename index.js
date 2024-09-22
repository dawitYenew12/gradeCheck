const http = require('http');
const express = require('express');
const loader = require('./loader');
const logger = require('./utils/logger');
const config = require('./config/config');

function exitHandler(server) {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
}

function unExpectedErrorHandler(server) {
  return function (error) {
    logger.error(error);
    exitHandler(server);
  };
}

const startServer = async () => {
  const app = express();
  await loader(app);
  const httpServer = http.createServer(app);
  httpServer.listen(config.port, () => {
    logger.info(`Server is running on port ${config.port}`);
  });

  process.on('uncaughtException', unExpectedErrorHandler);
  process.on('unhandledRejection', unExpectedErrorHandler);

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
      server.close();
    }
  });
};

startServer();
