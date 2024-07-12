import httpStatus from 'http-status';

import ExtendableError from './extendable-error';
import { LOG_LEVEL_ERROR } from '../app.constants';
import { isNil, isStringEmpty } from '../utils/global-helper';

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class APIError extends ExtendableError {
  /**
   * Creates an API error.
   *
   * @param {string} message Error message.
   * @param {string} [errorName=''] Error name.
   * @param {number} [code=50000] Error code.
   * @param {number} [status=httpStatus.INTERNAL_SERVER_ERROR] HTTP status code of error.
   * @param {string} [severity=LOG_LEVEL_ERROR] Error severity.
   * @param {boolean} [isPublic=false] Whether the message should be visible to user or not.
   *
   */
  constructor({
    message,
    errors,
    stack,
    errorName = '',
    code = 50000,
    status = httpStatus.INTERNAL_SERVER_ERROR,
    severity = LOG_LEVEL_ERROR,
    isPublic = false
  }) {
    super({
      message,
      errors,
      code,
      status,
      severity,
      isPublic,
      stack
    });
    if (errorName) this.name = errorName;
  }

  /**
   * Generate error message object
   *
   * @param {Object} source.error custom error object
   * @param {Object} source.data data
   * @param {String} source.url request URL
   * @param {String} source.method request method
   * @param {Object} source.body request body
   *
   * @return {Object}
   *
   */
  static generateErrorMessageObject({
    error,
    data,
    url = '',
    method = '',
    body
  }) {
    const req = { url, method, body };
    const errMsg = this.generateErrorMessage(error.MESSAGE, req, data);
    return {
      status: error.ERROR,
      statusText: error.LABEL,
      identifier: error.CODE,
      message: errMsg,
      description: error.DESCRIPTION
    };
  }

  /**
   * Generate error message based on template
   *
   * @param {Function} message message template literal
   * @param {Object} request request evidance
   * @param {Object} data data
   *
   * @return {String}
   *
   */
  static generateErrorMessage(message, request, data) {
    let { error } = data;
    if (error instanceof Error) {
      error = !isNil(error.message) && !isStringEmpty(error.message)
        ? error.message : `${error.name} (${error.code})`;
    }

    return message({
      ...data,
      request: JSON.stringify(request),
      error: JSON.stringify(error)
    });
  }
}

export default APIError;
