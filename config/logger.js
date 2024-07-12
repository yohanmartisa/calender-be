import DailyRotateFile from 'winston-daily-rotate-file';
import { createLogger, format, transports } from 'winston';

import {
  LOG_ROOT_DIR,
  LOG_DEFAULT_FILENAME,
  LOG_ERROR_FILENAME,
  LOG_IS_ZIPPED_ARCHIVE,
  LOG_MAX_FILE_SIZE,
  LOG_MAX_DEFAULT_FILES_EXPIRED,
  LOG_MAX_ERROR_FILES_EXPIRED,
  LOG_FORMAT
} from './config.constants';

const customFormat = format.printf(info => LOG_FORMAT(info));

const levelUpperCaseFormat = format(info => (
  Object.assign(info, { level: info.level.toUpperCase() })
));

const logger = createLogger({
  level: 'info',
  format: format.combine(
    levelUpperCaseFormat(),
    format.timestamp(),
    customFormat
  ),
  transports: [
    new DailyRotateFile({ // > error log into daily log file
      level: 'error',
      filename: LOG_ERROR_FILENAME,
      dirname: LOG_ROOT_DIR,
      zippedArchive: LOG_IS_ZIPPED_ARCHIVE,
      maxSize: LOG_MAX_FILE_SIZE,
      maxFiles: LOG_MAX_ERROR_FILES_EXPIRED
    }),
    new DailyRotateFile({ // > info log into daily log file
      level: 'info',
      filename: LOG_DEFAULT_FILENAME,
      dirname: LOG_ROOT_DIR,
      zippedArchive: LOG_IS_ZIPPED_ARCHIVE,
      maxSize: LOG_MAX_FILE_SIZE,
      maxFiles: LOG_MAX_DEFAULT_FILES_EXPIRED
    })
  ]
});

/* istanbul ignore if: test will set env as `test` */
if (process.env.NODE_ENV === 'dev') {
  logger.add(new transports.Console({ // log into console
    format: format.combine(
      levelUpperCaseFormat(),
      format.timestamp(),
      format.colorize(),
      customFormat
    )
  }));
}

export default logger;
