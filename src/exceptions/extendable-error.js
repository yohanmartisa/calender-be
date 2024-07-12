/**
 * Class representing an extendable error.
 * @extends Error
 */
class ExtendableError extends Error {
  /**
   * Creates an API error.
   *
   * @param {string} message Error message.
   * @param {Array} errors List of error.
   * @param {code} code Error code.
   * @param {number} status HTTP status code of error.
   * @param {string} severity Error severity.
   * @param {boolean} isPublic Whether the message should be visible to user or not.
   * @param {string} stack Error stack.
   *
   */
  constructor({
    message,
    errors,
    code,
    status,
    severity,
    isPublic,
    stack
  }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.errors = errors;
    this.code = code;
    this.status = status;
    this.severity = severity;
    this.isPublic = isPublic;
    this.isOperational = true;
    this.stack = stack;
  }
}

export default ExtendableError;
