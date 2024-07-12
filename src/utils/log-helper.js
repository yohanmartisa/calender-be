import logger from '../../config/logger';

/**
 * Get info message based on template
 *
 * @param {Function} message message template literal
 * @param {Object} request request evidance
 * @param {Object} data data evidance
 *
 * @return {String}
 *
 */
const getInfoMessage = (message, request, data) => (
  message({
    ...data,
    request: JSON.stringify(request)
  })
);

/**
 * Get info object
 *
 * @param {Object} source.info custom info object
 * @param {Object} source.data data evidance
 * @param {String} source.url request URL
 * @param {String} source.method request method
 * @param {Object} source.body request body
 *
 * @return {Object}
 *
 */
const getInfo = ({
  info, data, url, method, body
}) => ({
  statusText: info.LABEL,
  identifier: info.CODE,
  message: getInfoMessage(info.MESSAGE, { url, method, body }, data)
});

const logError = ({ label, message }) => {
  logger.error({ label, message });
};

const logWarn = ({ label, message }) => {
  logger.warn({ label, message });
};

const logInfo = ({ label, message }) => {
  logger.info({ label, message });
};

const log = ({ level, label, message }) => {
  logger.log({ level, label, message });
};

export {
  getInfo,
  logError,
  logWarn,
  logInfo,
  log
};
