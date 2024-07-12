import logger from '../../config/logger';

/**
 * Generate error message based on template
 *
 * @param {Function} message message template literal
 * @param {Object} data data
 *
 * @return {String}
 *
 */
const generateErrorMessage = (message, data) => {
  const error = data.error instanceof Error
    ? data.error.message : data.error;
  return message({ ...data, error: JSON.stringify(error) });
};

/**
 * Generate error message object
 *
 * @param {Object} error custom error object
 * @param {Object} data data
 *
 * @return {Object}
 *
 */
const generateErrorMessageObject = (error, data) => {
  const errMsg = generateErrorMessage(error.MESSAGE, data);
  return {
    status: error.ERROR,
    statusText: error.LABEL,
    identifier: error.CODE,
    message: errMsg,
    description: error.DESCRIPTION
  };
};

const logError = (error, data) => {
  const err = generateErrorMessageObject(error, data);
  logger.error({ label: err.statusText, message: err.message });
};

const logWarn = (error, data) => {
  const err = generateErrorMessageObject(error, data);
  logger.warn({ label: err.statusText, message: err.message });
};

export {
  generateErrorMessage,
  generateErrorMessageObject,
  logError,
  logWarn
};
