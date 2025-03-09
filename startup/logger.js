const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf, colorize} = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

module.exports = createLogger({
  level: "info",
  format: combine(
    label({ label: 'express-app' }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    colorize(),
    logFormat
  ),  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/logfile.log" }),
  ],
  exceptionHandlers: [
    new transports.Console(),
    new transports.File({
      filename: "logs/exceptions.log",
    }),
  ],

  rejectionHandlers: [
    new transports.Console(),
    new transports.File({
      filename: "logs/rejections.log",
    }),
  ],
  exitOnError: true,
}); 