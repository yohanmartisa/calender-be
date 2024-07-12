import httpStatus from 'http-status';

import APIError from './api-error';
import { logWarn } from '../utils/log-helper';
import { LOG_LEVEL_WARN } from '../app.constants';
import { INVALID_CREDENTIALS } from './exceptions.constants';

/**
 * Class representing an Invalid Credentials error.
 * @extends APIError
 */
class InvalidCredentialsError extends APIError {
  /**
   * Creates an Invalid Credentials error.
   *
   * @param {Object} data Error data.
   * @param {Object} [errorTmpl=INVALID_CREDENTIALS] Error template.
   * @param {boolean} [logging=true] Whether the message should be log or not.
   *
   */
  constructor(data, errorTmpl = INVALID_CREDENTIALS, logging = true) {
    const err = APIError.generateErrorMessageObject({ error: errorTmpl, data });
    if (logging) logWarn({ label: err.statusText, message: err.message });

    super({
      message: err.description,
      errors: data.error.errors,
      stack: data.error.stack,
      code: err.status,
      status: httpStatus.UNAUTHORIZED,
      severity: LOG_LEVEL_WARN
    });
  }
}

export default InvalidCredentialsError;
