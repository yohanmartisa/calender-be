/**
 * Gets the value at path of value.
 * If the resolved value is undefined, the defaultValue is returned in its place.
 *
 * @param {Object} value The object to query.
 * @param {Array|String} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for undefined resolved values.
 *
 * @return {*}
 *
 */
const get = (value, path, defaultValue) => {
  const result = String(path).split('.').reduce((acc, v) => {
    try {
      return acc[v];
    } catch (e) {
      return defaultValue;
    }
  }, value);
  return result === undefined ? defaultValue : result;
};

/**
 * Checks if path is a direct property of object.
 *
 * @param {Object} value The object to query.
 * @param {Array|String} path The path to check.
 *
 * @return {Boolean}
 *
 */
const has = (value, path) => !!get(value, path, false);

/**
 * Zip into an object that accepts two arrays,
 * one of property identifiers and one of corresponding values.
 *
 * @param {Array} [props=[]] The property identifiers.
 * @param {Array} [values=[]] The property values.
 *
 * @return {Object}
 *
 */
const zipObject = (props = [], values = []) => (
  props.reduce((prev, prop, i) => (
    Object.assign(prev, { [prop]: values[i] })
  ), {})
);

/**
 * Creates a deep clone of value.
 *
 * @param {*} [value] The value to recursively clone.
 *
 * @return {*}
 *
 */
const deepClone = (value) => {
  if (typeof value !== 'object' || value === null) {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof Array) {
    return value.reduce((arr, item, i) => {
      const cloneArr = [...arr];
      cloneArr[i] = deepClone(item);
      return cloneArr;
    }, []);
  }

  return Object.keys(value).reduce((newObj, key) => {
    const cloneObj = Object.assign({}, newObj);
    cloneObj[key] = deepClone(value[key]);
    return cloneObj;
  }, {});
};

/**
 * Checks if value is type of Object.
 *
 * @param {*} value The value to check.
 *
 * @return {Boolean}
 *
 */
const isObject = value => value === Object(value);

/**
 * Find object key by its value, return the first finding.
 *
 * @param {Object} object The object to inspect.
 * @param {*} value The value to compare.
 *
 * @return {*}
 *
 */
const findKey = (object, value) => (
  Object.keys(object).find(key => object[key] === value)
);

/**
 * Creates an array of elements, ordered in ascending order (by default)
 * by the results of running each element in a collection thru each iteratee.
 * Specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @param {Array} collection The collection to iterate over.
 * @param {Function} iteratees The iteratees to order by.
 * @param {String} [orders='ASC'] The sort orders of key.
 *
 * @return {*}
 *
 */
const orderBy = (collection, iteratees, orders = 'ASC') => {
  let compareFn = (a, b) => {
    if (iteratees(a) > iteratees(b)) { return 1; }
    return (iteratees(b) > iteratees(a)) ? -1 : 0;
  };
  if (orders === 'DESC') {
    compareFn = (a, b) => {
      if (iteratees(a) > iteratees(b)) { return -1; }
      return (iteratees(b) > iteratees(a)) ? 1 : 0;
    };
  }

  return collection.concat().sort(compareFn);
};

/**
 * Creates an array of values by running each element in collection
 * thru callback function asynchronously.
 *
 * @param {Array} collection The collection to iterate over.
 * @param {Function} callbackfn The function invoked per iteration.
 *
 * @return {Promise}
 *
 */
const asyncMap = (collection, callbackfn) => (
  Promise.all(collection.map(callbackfn))
);

/**
 * Creates an object composed of the picked object properties.
 *
 * @param {Object} object The source object.
 *  @param {Array} [paths] The property paths to pick.
 *
 * @return {Object}
 *
 */
const pick = (object, paths) => {
  if (!paths) return object;
  return paths.reduce((prev, path) => (
    Object.assign(prev, { [path]: object[path] })
  ), {});
};

/**
 * Creates an array of object composed of the picked object properties.
 *
 * @param {Array} values The array to query.
 * @param {Array} [paths] The property paths to pick.
 *
 * @return {Array}
 *
 */
const select = (values, paths) => (
  values.map(v => pick(v, paths))
);

/**
 * Checks if value is null or undefined.
 *
 * @param {*} value The value to check.
 *
 * @return {Boolean}
 *
 */
const isNil = value => value === null || value === undefined;

/**
 * Checks if string value is empty string or 'null' or 'undefined'.
 *
 * @param {String} value The value to check.
 *
 * @return {Boolean}
 *
 */
const isStringEmpty = value => value === '' || value === 'null' || value === 'undefined';

/**
 * Checks if all object values is nul or empty string.
 *
 * @param {Object} object The object to check.
 *
 * @return {Boolean}
 *
 */
const isObjectValuesEmpty = object => (
  Object.values(object).every(v => isNil(v) || v === '')
);

/**
 * Converts the first character of string to upper case and the remaining to lower case.
 *
 * @param {String} [string=''] The string to capitalize.
 *
 * @return {String}
 *
 */
const capitalize = (string = '') => (
  `${string.charAt(0).toUpperCase()}${string.slice(1)}`
);

/**
 * Check every element of array.
 * If has same element, the element just will be return once.
 *
 * @param {Array} array The array will check.
 * @return {Array}
 *
 */
const arrayUnique = (array) => {
  const result = array.filter((elem, pos) => array.indexOf(elem) === pos);
  return result;
};

export {
  get,
  has,
  zipObject,
  deepClone,
  isObject,
  findKey,
  orderBy,
  asyncMap,
  pick,
  select,
  isNil,
  isStringEmpty,
  isObjectValuesEmpty,
  capitalize,
  arrayUnique
};
