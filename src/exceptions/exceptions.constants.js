const errorDetails = o => `The error is "${o.error}"`;

/* === INTERNAL_SERVER_ERROR 500 === */

// Unknown Error: 50000
export const UNKNOWN_ERROR = {
  ERROR: 50000,
  CODE: 'UNKNOWN_ERROR',
  LABEL: 'Unknown Error',
  MESSAGE: o => `There was a problem in the server. ${errorDetails(o)}`,
  DESCRIPTION: 'There was a problem in the server.'
};

// API Error: 50001
export const API_ERROR = {
  ERROR: 50001,
  CODE: 'API_ERROR',
  LABEL: 'API Error',
  MESSAGE: o => `There was a problem while trying to request an API of "${o.request}". The error is "${o.errorName}"`,
  DESCRIPTION: 'There was a problem while trying to request an API.'
};

// Repository Error: 50002
export const REPOSITORY_ERROR = {
  ERROR: 50002,
  CODE: 'REPOSITORY_ERROR',
  LABEL: 'Repository Error',
  MESSAGE: o => `There was a problem while accessing data source of "${o.domainObject}". ${errorDetails(o)}`,
  DESCRIPTION: 'There was a problem while accessing data source.'
};

// Request Failed: 50003
export const REQUEST_FAILED = {
  ERROR: 50003,
  CODE: 'REQUEST_FAILED',
  LABEL: 'API Request Failed',
  MESSAGE: 'There was a problem while making API request.',
  DESCRIPTION: 'There was a problem while making API request.'
};
// Database Error: 50010
export const DB_ERROR = {
  ERROR: 50010,
  CODE: 'DB_ERROR',
  LABEL: 'Database Error',
  MESSAGE: o => `There was a problem while querying table "${o.table}" in database. ${errorDetails(o)}`,
  DESCRIPTION: 'There was a problem while querying into database.'
};

// Database Transaction Error: 50011
export const DB_TRANSACTION_ERROR = {
  ERROR: 50011,
  CODE: 'DB_TRANSACTION_ERROR',
  LABEL: 'Database Transaction Error',
  MESSAGE: o => `There was a problem while querying table "${o.table}" (with transaction) in database and will be rollback automatically. ${errorDetails(o)}`,
  DESCRIPTION: 'There was a problem while querying (with transaction) into database.'
};

// Excel Generate Error: 50020
export const EXCEL_GENERATE_ERROR = {
  ERROR: 50020,
  CODE: 'EXCEL_GENERATE_ERROR',
  LABEL: 'Excel Generate Error',
  MESSAGE: o => `There was a problem while generating an excel file of "${o.filename}". ${errorDetails(o)}`,
  DESCRIPTION: 'There was a problem while generating an excel file.'
};

// Auth Error: 50030
export const AUTH_ERROR = {
  ERROR: 50030,
  CODE: 'AUTH_ERROR',
  LABEL: 'Authentication Error',
  MESSAGE: o => `There was a problem while trying authentication. ${errorDetails(o)}`,
  DESCRIPTION: 'There was a problem while trying authentication.'
};

// Write File Error: 50040
export const WRITE_FILE_ERROR = {
  ERROR: 50040,
  CODE: 'WRITE_FILE_ERROR',
  LABEL: 'Write File Error',
  MESSAGE: o => `There was a problem while writing a file to to "${o.path}". ${errorDetails(o)}`,
  DESCRIPTION: 'There was a problem while writing a file to storage.'
};

// Failed to Update Vessel Transaction: 50050
export const FAILED_UPDATE_VESSEL_TRANSACTION = {
  ERROR: 50050,
  CODE: 'FAILED_UPDATE_VESSEL_TRANSACTION',
  LABEL: 'Failed to Update Vessel Transaction',
  MESSAGE: o => `Failed to update transaction of vessel "${o.details}".  ${errorDetails(o)}`,
  DESCRIPTION: 'Failed to update vessel transaction.'
};

// Alfresco Error: 50060
export const ALFRESCO_ERROR = {
  ERROR: 50060,
  CODE: 'ALFRESCO_ERROR',
  LABEL: 'Alfresco Error',
  MESSAGE: o => `There was a problem while trying to process media on media server. ${errorDetails(o)}`,
  DESCRIPTION: 'There was a problem while trying to process media on media server.'
};

// Timeout Server Error: 50070
export const TIMEOUT_SERVER_ERROR = {
  ERROR: 50070,
  CODE: 'TIMEOUT_SERVER_ERROR',
  LABEL: 'Time Out Error',
  MESSAGE: o => `Server Timeout. ${errorDetails(o)}`,
  DESCRIPTION: 'Server Timeout.'
};

/* === UNPROCESSABLE_ENTITY 422 === */

// Validation Error: 42200
export const VALIDATION_ERROR = {
  ERROR: 42200,
  CODE: 'VALIDATION_ERROR',
  LABEL: 'Validation Error',
  MESSAGE: o => `Can't process the entity due to invalid data. The details are "${o.details}".`,
  DESCRIPTION: 'Can\'t process the entity due to invalid data.'
};
// Validation Error: 42210
export const TOTAL_PERCENT_VALIDATION_ERROR = {
  ERROR: 42210,
  CODE: 'TOTAL_PERCENT_VALIDATION_ERROR',
  LABEL: 'Total Percent Validation Error',
  MESSAGE: o => `Unable to process entity because the total percentage is more than 100 percent. The details are "${o.details}".`,
  DESCRIPTION: 'Unable to process entity because the total percentage is more than 100 percent.'
};
// Validation Error: 42220
export const THIRD_PARTY_COAL_VALIDATION_ERROR = {
  ERROR: 42220,
  CODE: 'THIRD_PARTY_COAL_VALIDATION_ERROR',
  LABEL: 'Third Party Coal Validation Error',
  MESSAGE: o => `Unable to process entity because cannot contain number. The details are "${o.details}".`,
  DESCRIPTION: 'Unable to process entity because cannot contain number.'
};
// Validation Error: 42230
export const BARGE_ALREADY_USED_ERROR = {
  ERROR: 42230,
  CODE: 'BARGE_ALREADY_USED_ERROR',
  LABEL: 'Barge Alread Used Error',
  MESSAGE: o => `Unable to process entity because ${o.details}.`,
  DESCRIPTION: 'Unable to process entity because barge already used.'
};

// Validation Error: 42240
export const TUG_ALREADY_USED_ERROR = {
  ERROR: 42240,
  CODE: 'TUG_ALREADY_USED_ERROR',
  LABEL: 'Tug Alread Used Error',
  MESSAGE: o => `Unable to process entity because ${o.details}.`,
  DESCRIPTION: 'Unable to process entity because Tug already exist.'
};

// Validation Error: 42250
export const INACTIVE_DATA_USED_ERROR = {
  ERROR: 42250,
  CODE: 'INACTIVE_DATA_USED_ERROR',
  LABEL: 'Inactive Data Used Error',
  MESSAGE: o => `Unable to inactive entity. The details barge are - ${o.details}.`,
  DESCRIPTION: 'Unable to inactive entity'
};

// Validation Error: 42260
export const USER_ALREADY_USED_ERROR = {
  ERROR: 42260,
  CODE: 'USER_ALREADY_USED_ERROR',
  LABEL: 'User Already Used Error',
  MESSAGE: o => `Unable to process entity because ${o.details}.`,
  DESCRIPTION: 'Unable to process entity because User already exist.'
};

/* === NOT_FOUND 404 === */

// Empty Result: 40400
export const EMPTY_RESULT = {
  ERROR: 40400,
  CODE: 'EMPTY_RESULT',
  LABEL: 'Empty Result',
  MESSAGE: o => `No results found of "${o.dataKey}".`,
  DESCRIPTION: 'No results found.'
};

// Database Empty Result: 40410
export const DB_EMPTY_RESULT = {
  ERROR: 40410,
  CODE: 'DB_EMPTY_RESULT',
  LABEL: 'Database Empty Result',
  MESSAGE: o => `No results found during querying table "${o.table}" in database.`,
  DESCRIPTION: 'No results found during querying into database.'
};
export const TUG_NOT_FOUND = {
  ERROR: 40420,
  CODE: 'TUG_NOT_FOUND',
  LABEL: 'Tug Not Found',
  MESSAGE: o => `${o.details}.`,
  DESCRIPTION: 'No matching tug or gps name in database.'
};
// Vessel Transaction Not Found: 40450
export const VESSEL_TRANSACTION_NOT_FOUND = {
  ERROR: 40450,
  CODE: 'VESSEL_TRANSACTION_NOT_FOUND',
  LABEL: 'Vessel Transaction Not Found',
  MESSAGE: o => `Transaction of vessel "${o.vesselName}" is not found.`,
  DESCRIPTION: 'No vessel transaction found.'
};

/* === UNAUTHORIZED 401 === */

// Invalid Credentials: 40110
export const INVALID_CREDENTIALS = {
  ERROR: 40110,
  CODE: 'INVALID_CREDENTIALS',
  LABEL: 'Invalid Credentials',
  MESSAGE: o => `These credentials do not match. ${errorDetails(o)}`,
  DESCRIPTION: 'These credentials do not match.'
};
