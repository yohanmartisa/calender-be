import APIError from './api-error';
import { logError } from '../utils/log-helper';
import { WRITE_FILE_ERROR } from './exceptions.constants';

/**
 * Class representing an Write file error.
 * @extends APIError
 */
class WriteFileError extends APIError {
  /**
   * Creates a Write File error.
   *
   * @param {Object} data Error data.
   * @param {boolean} [logging=true] Whether the message should be log or not.
   *
   */
  constructor(data, logging = true) {
    const err = APIError.generateErrorMessageObject({ error: WRITE_FILE_ERROR, data });
    if (logging) logError({ label: err.statusText, message: err.message });

    super({
      message: err.description,
      errors: [data.error],
      stack: data.error.stack,
      code: err.status
    });
  }
}

export default WriteFileError;
