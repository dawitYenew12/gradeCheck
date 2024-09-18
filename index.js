const http = require('http');
const express = require('express');
const loader = require('./loader');
const logger = require('config/logger');

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
  httpServer.listen(process.PORT, () => {
    logger.info(`Server is running on port ${process.PORT}`);
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
