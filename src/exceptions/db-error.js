import APIError from './api-error';
import { logError } from '../utils/log-helper';
import { DB_ERROR } from './exceptions.constants';

/**
 * Class representing a DB error.
 * @extends APIError
 */
class DbError extends APIError {
  /**
   * Creates a DB error.
   *
   * @param {Object} data Error data.
   * @param {boolean} [logging=false] Whether the message should be log or not.
   *
   */
  constructor(data, logging = true) {
    const err = APIError.generateErrorMessageObject({ error: DB_ERROR, data });
    if (logging) logError({ label: err.statusText, message: err.message });

    super({
      message: err.description,
      errors: [data.error],
      stack: data.error.stack,
      code: err.status
    });
  }
}

export default DbError;
