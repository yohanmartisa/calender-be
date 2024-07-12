import httpStatus from 'http-status';
import expressValidation from 'express-validation';

import Config from '../../config';
import APIError from '../exceptions/api-error';
import { logWarn, logError } from '../utils/log-helper';
import ValidationError from '../exceptions/validation-error';
import { API_ERROR } from '../exceptions/exceptions.constants';
import { LOG_LEVEL_WARN, LOG_LEVEL_ERROR } from '../app.constants';

const config = Config.get('/');

/**
 * Error handler. Send stacktrace only during development
 *
 * @param {APIError} err Error of APIError
 * @param {Object} req Request
 * @param {Object} res Response
 *
 * @return {void}
 *
 */
const handler = (err, req, res) => {
  const response = {
    error: {
      code: err.code,
      message: err.message || httpStatus[err.status],
      errors: err.errors
    }
  };

  // set stacktrace to response in development env
  if (config.env === 'dev') {
    response.error.stack = err.stack;
  }

  // log the error
  const apiErr = APIError.generateErrorMessageObject({
    error: API_ERROR,
    data: { errorName: err.name },
    url: req.originalUrl,
    method: req.originalMethod || req.method
  });
  const logObj = { label: apiErr.statusText, message: apiErr.message };
  if (err.severity === LOG_LEVEL_WARN) logWarn(logObj);
  else if (err.severity === LOG_LEVEL_ERROR) logError(logObj);

  res.status(err.status).send(response);
};

/**
 * Convert error into APIError
 *
 * @param {Error} err Error
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Function} next Next function
 *
 * @return {void}
 *
 */
const converter = (err, req, res, next) => {
  let convertedError = err;

  if (err instanceof expressValidation.ValidationError) {
    convertedError = new ValidationError({
      error: err,
      details: JSON.stringify(err.errors)
    });
  } else if (!(err instanceof APIError)) {
    convertedError = new APIError({
      errorName: err.name,
      message: err.message,
      status: err.status,
      stack: err.stack
    });
  }

  handler(convertedError, req, res, next);
};

/**
 * Catch 404 and forward to error handler
 *
 * @param {Object} req Request
 * @param {Object} res Response
 * @param {Function} next Next function
 *
 * @return {void}
 *
 */
const notFound = (req, res, next) => {
  const err = new APIError({
    message: 'Not found',
    status: httpStatus.NOT_FOUND
  });

  handler(err, req, res, next);
};

export {
  handler,
  converter,
  notFound
};
