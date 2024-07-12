import Joi from 'joi';
import momentTz from 'moment-timezone';

import {
  TIMEZONE,
  DATE_FORMAT,
  UNREGISTERED_COMPANY
} from '../app.constants';
import {
  get,
  has,
  zipObject,
  findKey
} from './global-helper';

/**
 * get a number of given value
 *
 * @param {*} value Given value
 *
 * @return {Number}
 *
 */
const getNumber = value => typeof value === 'number' ? value : 0;

/**
 * return momentjs timestamp object with default timezone
 *
 * @param {Date|Array|Object|String} timestamp timestamp
 *
 * @return {Object}
 *
 */
const getTimestampObject = (timestamp) => {
  if (!timestamp) return null;
  return momentTz(timestamp).tz(TIMEZONE);
};

/**
 * return timestamp string in full format (date, time, timezone offset)
 *
 * @param {Date|Array|Object|String} timestamp timestamp
 *
 * @return {String}
 *
 */
const getTimestampString = (timestamp) => {
  if (!timestamp) return '';
  return getTimestampObject(timestamp).format();
};

/**
 * return timestamp with specific format
 *
 * @param {Date|Array|Object|String} timestamp timestamp
 * @param {String} [format=''] timestamp format
 *
 * @return {String}
 *
 */
const getTimestampFormat = (timestamp, format = '') => {
  if (!timestamp) return '';
  const timestampObj = getTimestampObject(timestamp);
  return format ? timestampObj.format(format) : timestampObj.format();
};

/**
 * return momentjs timestamp object from given date with UTC timezone
 *
 * @param {Date|Array|Object|String} date given date
 *
 * @return {MomentTimezone}
 *
 */
const setDateToUTCZone = (date) => {
  if (!date) return null;
  return momentTz.tz(date, 'UTC');
};

/**
 * Checks if given timestamp is same date (year, month, and day) with given date
 *
 * @param {Date|Array|Object|String} timestamp given timestamp
 * @param {Date|Array|Object|String} date given date
 *
 * @return {Boolean}
 *
 */
const isTimestampSameDate = (timestamp, date) => (
  getTimestampObject(timestamp).isSame(getTimestampFormat(date, DATE_FORMAT), 'day')
);

/**
 * return single object or array
 *
 * @param {Array} data data
 *
 * @return {Object|Array}
 *
 */
const returnObjectOrArray = (data) => {
  if (Array.isArray(data)) {
    return data.length === 1 ? data[0] : data;
  }
  return data;
};

/**
 * return error object
 *
 * @param {Object} error error
 * @param {Object} [details=null] addtional details
 *
 * @return {Object}
 *
 */
const returnErrorObject = (error, details = null) => ({
  error: {
    status: error.status,
    message: error.description,
    details
  }
});

/**
 * validating data of request body
 *
 * @param {Object|Array} data request body
 * @param {Object} objectSchema object schema
 * @param {Array} [uniqueProperties=[]] unique properties for error message
 *
 * @return {Object}
 *
 */
const validateData = (data, objectSchema, uniqueProperties = []) => {
  const invalidData = [];
  const dataArr = !Array.isArray(data) ? [data] : data;
  const validData = dataArr.filter((object) => {
    const result = Joi.validate(object, objectSchema);
    if (result.error === null) return true;

    // add invalid data
    const invalidObject = { error: result.error.details };
    if (uniqueProperties.length > 0) {
      invalidObject.data = zipObject(uniqueProperties, uniqueProperties
        .map(property => get(object, property)));
    }

    invalidData.push(invalidObject);
    return false;
  });

  return { validData, invalidData };
};

/**
 * Get transformator function of Value Transformators by property
 *
 * @param {Object} transformators The transformators object to inspect.
 * @param {*} prop The transformators property.
 *
 * @return {Function}
 *
 */
const getValueTransformator = (transformators, prop) => (
  has(transformators, prop) ? transformators[prop] : transformators.defaults
);

/**
 * Transform object structure & values into specific target structure with
 * Value Transformators
 *
 * @param {Array|Object} value The value to transform
 * @param {String} options.transformInto Target transformation (e.g. 'model', 'object')
 * @param {Object} options.dictionary Structure dictionary
 * @param {Object} [options.valueTransformators={}] Value Transformators
 * @param {Array} [options.additionalKeys=[]] Additional keys for target structure
 *
 * @return {Array|Object}
 *
 */
const transformStructure = (value, {
  transformInto,
  dictionary,
  valueTransformators = {},
  additionalKeys = []
}) => {
  // get the values to transform
  const isArray = Array.isArray(value);
  let values = !isArray ? [value] : value;

  // set default transformator
  const transformators = Object.assign(valueTransformators, {
    defaults: val => val
  });

  if (transformInto === 'object' || transformInto === 'model') {
    // create `getKey` function
    const getKey = transformInto === 'object'
      ? (dict, prop) => findKey(dict, prop)
      : (dict, prop) => dict[prop];

    values = values.map((data) => {
      if (!data) return null;

      // transform the data
      const tempObj = {};
      Object.keys(data).forEach((prop) => {
        const transformator = !additionalKeys.includes(prop)
          ? getValueTransformator(transformators, prop)
          : transformators.defaults;
        const key = getKey(dictionary, prop);
        if (key) tempObj[key] = transformator(data[prop]);
      });

      // transform the data with additional keys
      additionalKeys.forEach((prop) => {
        if (has(transformators, prop)) {
          const transformator = transformators[prop];
          // transformator(original, transformed)
          tempObj[prop] = transformator(data, tempObj);
        } else {
          tempObj[prop] = null;
        }
      });
      return tempObj;
    }).filter(data => data !== null);
  }

  return isArray ? values : values[0];
};

/**
 * Get company name
 *
 * @param {String} companyName Given company name
 *
 * @return {String}
 *
 */
const getCompanyName = companyName => (
  companyName === UNREGISTERED_COMPANY ? '' : companyName
);

/**
 * Get date(s) string to be put in filename
 *
 * @param {Array} timestamps Array of given timestamp
 *
 * @return {String}
 *
 */
const geDateFilename = (timestamps) => {
  if (!timestamps.every(v => !!v)) return getTimestampFormat(new Date(), DATE_FORMAT);

  // check if all timestamps are same date
  const firstDate = getTimestampFormat(timestamps[0], DATE_FORMAT);
  const isSameDate = timestamps.every(v => getTimestampFormat(v, DATE_FORMAT) === firstDate);

  // get date filename
  const dateFilename = !isSameDate
    ? timestamps.reduce((acc, val) => {
      const dateStr = getTimestampFormat(val, DATE_FORMAT);
      return acc ? `${acc} - ${dateStr}` : dateStr;
    }, '')
    : firstDate;
  return `(${dateFilename})`;
};

/**
 * Get unique array grouped by groupKey and maximum value at findMaxKey
 *
 * @param {Array} array Array of object
 * @param {String} groupKey Object key used to group the array
 * @param {String} findMaxKey Object key used to find the maximum value in array
 *
 * @return {Array}
 *
 */
const getUniqueArray = (array, groupKey, findMaxKey) => {
  const result = [];
  const arrayKey = array.map(trans => trans[groupKey]);
  const uniqueArrayKeys = arrayKey.filter((trans, index) => arrayKey.indexOf(trans) === index);
  uniqueArrayKeys.forEach((uniqueArrayKey) => {
    const arrayFindKey = array.filter(trans => trans[groupKey] === uniqueArrayKey).map(trans => trans[findMaxKey]);
    const maxArrayFindKey = arrayFindKey.reduce((acc, val) => (acc > val ? acc : val));
    const data = array.find(trans => trans[groupKey] === uniqueArrayKey && trans[findMaxKey] === maxArrayFindKey);
    result.push(data);
  });

  return result;
};

export {
  getNumber,
  getTimestampObject,
  getTimestampString,
  getTimestampFormat,
  setDateToUTCZone,
  isTimestampSameDate,
  returnObjectOrArray,
  returnErrorObject,
  validateData,
  transformStructure,
  getCompanyName,
  geDateFilename,
  getUniqueArray
};
