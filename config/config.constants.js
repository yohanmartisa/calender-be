// EXPRESS.JS
export const BODY_JSON_LIMIT = '5mb';
export const API_ROUTES_VERSION = '/';

// LOGGER
export const LOG_ROOT_DIR = './logs';
export const LOG_DEFAULT_FILENAME = '%DATE%.combined.log';
export const LOG_ERROR_FILENAME = '%DATE%.error.log';
export const LOG_IS_ZIPPED_ARCHIVE = true;
export const LOG_MAX_FILE_SIZE = '20m';
export const LOG_MAX_DEFAULT_FILES_EXPIRED = '14d';
export const LOG_MAX_ERROR_FILES_EXPIRED = '7d';
export const LOG_FORMAT = log => `${log.timestamp} [${log.level}] ${log.label}: ${log.message}`;

export const INTERNAL = 'INTERNAL';
