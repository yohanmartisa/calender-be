import httpStatus from 'http-status';

import APIError from './api-error';
import { logWarn } from '../utils/log-helper';
import { LOG_LEVEL_WARN } from '../app.constants';
import { EMPTY_RESULT } from './exceptions.constants';

/**
 * Class representing an Empty Result error.
 * @extends APIError
 */
class EmptyResultError extends APIError {
  /**
   * Creates an Empty Result error.
   *
   * @param {Object} data Error data.
   * @param {Object} [errorTmpl=EMPTY_RESULT] Error template.
   * @param {boolean} [logging=true] Whether the message should be log or not.
   *
   */
  constructor(data, errorTmpl = EMPTY_RESULT, logging = true) {
    const err = APIError.generateErrorMessageObject({ error: errorTmpl, data });
    if (logging) logWarn({ label: err.statusText, message: err.message });

    super({
      message: err.description,
      errors: [],
      stack: null,
      code: err.status,
      status: httpStatus.OK,
      severity: LOG_LEVEL_WARN
    });
  }
}

export default EmptyResultError;
