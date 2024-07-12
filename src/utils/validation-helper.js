import { zipObject, get } from './global-helper';

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
export const validateData = (data, objectSchema, uniqueProperties = []) => {
  const invalidData = [];
  const dataArr = !Array.isArray(data) ? [data] : data;
  const validData = dataArr.filter((object) => {
    const result = objectSchema.validate(object);
    if (!result.error) return true;
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
