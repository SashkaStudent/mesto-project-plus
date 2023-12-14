import winston from "winston";
import expressWinston from "express-winston";
import "winston-daily-rotate-file";

const transport = new winston.transports.DailyRotateFile({
  filename: "error-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  maxSize: "20m",
  zippedArchive: true,
  maxFiles: 14,
});

const transportRequest = new winston.transports.DailyRotateFile({
  filename: "request-%DATE%.log",
  datePattern: "YYYY-MM-DD-HH",
  maxSize: "20m",
  zippedArchive: true,
  maxFiles: 14,
});

export const requestLogger = expressWinston.logger({
  transports: [transportRequest],
  format: winston.format.json(),
});

export const errorLogger = expressWinston.errorLogger({
  transports: [transport],
  format: winston.format.json(),
});
