import httpStatus from 'http-status';

import APIError from './api-error';
import { logWarn } from '../utils/log-helper';
import { LOG_LEVEL_WARN } from '../app.constants';
import { USER_ALREADY_USED_ERROR } from './exceptions.constants';

/**
 * Class representing an User Already Used Error.
 * @extends APIError
 */
class UserAlreadyUsedError extends APIError {
  /**
   * Creates a User Already Used error.
   *
   * @param {Object} data Error data.
   * @param {boolean} [logging=true] Whether the message should be log or not.
   *
   */
  constructor(data, errorTmpl = USER_ALREADY_USED_ERROR, logging = true) {
    const err = APIError.generateErrorMessageObject({ error: errorTmpl, data });
    if (logging) logWarn({ label: err.statusText, message: err.message });
    super({
      message: err.message,
      errors: [],
      stack: null,
      code: err.status,
      status: httpStatus.OK,
      severity: LOG_LEVEL_WARN
    });
  }
}

export default UserAlreadyUsedError;
