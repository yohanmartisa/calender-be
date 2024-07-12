import httpStatus from 'http-status';

import APIError from './api-error';
import { logWarn } from '../utils/log-helper';
import { LOG_LEVEL_WARN } from '../app.constants';
import { VALIDATION_ERROR } from './exceptions.constants';

/**
 * Class representing a Validation error.
 * @extends APIError
 */
class ValidationError extends APIError {
  /**
   * Creates a Validation error.
   *
   * @param {Object} data Error data.
   * @param {Object} [errorTmpl=VALIDATION_ERROR] Error template.
   * @param {boolean} [logging=true] Whether the message should be log or not.
   *
   */
  constructor(data, errorTmpl = VALIDATION_ERROR, logging = true) {
    const err = APIError.generateErrorMessageObject({ error: errorTmpl, data });
    if (logging) logWarn({ label: err.statusText, message: err.message });

    super({
      message: err.description,
      errors: data.error.errors,
      stack: data.error.stack,
      code: err.status,
      status: httpStatus.UNPROCESSABLE_ENTITY,
      severity: LOG_LEVEL_WARN
    });
  }
}

export default ValidationError;
