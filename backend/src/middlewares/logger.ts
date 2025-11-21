import winston from 'winston';
import expressWinston from 'express-winston';
import path from 'path';

const requestLogPath = path.join(process.cwd(), 'request.log');
const errorLogPath = path.join(process.cwd(), 'error.log');

export const requestLogger = expressWinston.logger({
  transports: [new winston.transports.File({ filename: requestLogPath })],
  format: winston.format.json(),
  meta: true,
  msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
});

export const errorLogger = expressWinston.errorLogger({
  transports: [new winston.transports.File({ filename: errorLogPath })],
  format: winston.format.json(),
});
