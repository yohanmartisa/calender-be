import { USER_DICTIONARY } from './user.constants';
import { transformStructure } from '../../utils/controllers-helper';

/**
 * Transform each value into user model
 *
 * @param {Array} values The value to transform
 *
 * @return {Array}
 *
 */
export const toUserModel = (values) => {
  const transformators = {
    username: val => String(val).toLowerCase(),
    mail: val => String(val).toLowerCase()
  };

  return transformStructure(values, {
    transformInto: 'model',
    dictionary: USER_DICTIONARY,
    valueTransformators: transformators
  });
};
