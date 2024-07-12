import APIError from './api-error';
import { logError } from '../utils/log-helper';
import { TIMEOUT_SERVER_ERROR } from './exceptions.constants';

/**
 * Class representing a TIme Out error.
 * @extends APIError
 */
class TimeoutServer extends APIError {
  /**
   * Creates a TIme Out error.
   *
   * @param {Object} data Error data.
   * @param {boolean} [logging=false] Whether the message should be log or not.
   *
   */
  constructor(data, logging = true) {
    const err = APIError.generateErrorMessageObject({ error: TIMEOUT_SERVER_ERROR, data });
    if (logging) logError({ label: err.statusText, message: err.message });
    super({
      message: err.description,
      errors: data,
      code: err.status
    });
  }
}

export default TimeoutServer;
