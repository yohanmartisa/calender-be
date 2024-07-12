import APIError from './api-error';
import { logError } from '../utils/log-helper';
import { AUTH_ERROR } from './exceptions.constants';

/**
 * Class representing an Authentication error.
 * @extends APIError
 */
class AuthError extends APIError {
  /**
   * Creates an Authentication error.
   *
   * @param {Object} data Error data.
   * @param {Object} [errorTmpl=AUTH_ERROR] Error template.
   * @param {boolean} [logging=true] Whether the message should be log or not.
   *
   */
  constructor(data, errorTmpl = AUTH_ERROR, logging = true) {
    const err = APIError.generateErrorMessageObject({ error: errorTmpl, data });
    if (logging) logError({ label: err.statusText, message: err.message });

    super({
      message: err.description,
      errors: data.error.errors,
      stack: data.error.stack,
      code: err.status
    });
  }
}

export default AuthError;
