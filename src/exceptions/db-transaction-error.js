import APIError from './api-error';
import { logError } from '../utils/log-helper';
import { DB_TRANSACTION_ERROR } from './exceptions.constants';

/**
 * Class representing a DB Transaction error.
 * @extends APIError
 */
class DbTransactionError extends APIError {
  /**
   * Creates a DB Transaction error.
   *
   * @param {Object} data Error data.
   * @param {boolean} [logging=true] Whether the message should be log or not.
   *
   */
  constructor(data, logging = true) {
    const err = APIError.generateErrorMessageObject({ error: DB_TRANSACTION_ERROR, data });
    if (logging) logError({ label: err.statusText, message: err.message });

    super({
      message: err.description,
      errors: [data.error],
      stack: data.error.stack,
      code: err.status
    });
  }
}

export default DbTransactionError;
