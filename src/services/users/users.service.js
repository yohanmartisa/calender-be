import merge from 'deepmerge';

import UserAlreadyUsedError from '../../exceptions/user-already-used-error';
import { getTimestampString } from '../../utils/controllers-helper';
import { USER_USERNAME_ATTRIBUTES } from './users.constants';

const UsersService = (models) => {
  const {
    User
  } = models;

  const defaultOptions = {
    filter: {},
    paginateFilter: {},
    scopes: [],
    pagination: false
  };

  /**
   * Get user by username from users table.
   *
   * @param {String} username User's username
   *
   * @return {object}
   *
   */
  const getUserByUsername = async (username) => {
    const data = await User.findByUsername(username);
    return data;
  };

  /**
   * Get all user's username from users table.
   *
   * @return {object}
   *
   */
  const getAllUsername = async () => {
    const data = await User.findAll({
      findOptions: {
        attributes: USER_USERNAME_ATTRIBUTES
      }
    });
    const result = data.map(o => o.username);
    return result;
  };

  /**
   * Get all users from users table.
   *
   * @param {Object} options Options data
   *
   * @throws {DbError}
   * @throws {DbEmptyResultsError}
   *
   * @return {Array}
   *
   */
  const getAllUsers = async (options) => {
    // merge options with default options
    const opt = options ? merge(defaultOptions, options) : defaultOptions;

    if (options.paginateFilter.page && options.paginateFilter.paginate) opt.pagination = true;

    // setup query options
    let queryOptions = {
      ...(User.model.options.scopes.withFilter(opt.filter)),
      attributes: ['id', 'name'],
      distinct: true
    };
    if (opt.pagination) {
      queryOptions = {
        page: opt.paginateFilter.page,
        paginate: opt.paginateFilter.paginate,
        ...queryOptions
      };
    }

    // get all the data
    const results = await (opt.pagination
      ? User.findAllPaginate({ paginateOptions: queryOptions })
      : User.findAll({ findOptions: queryOptions }));

    return results;
  };

  /**
   * Get user detail from repository
   *
   * @param {Integer} id User id
   *
   * @return {Array}
   *
   */
  const getDetailUser = async (id) => {
    const userData = await User.findById(id, {
      findOptions: {
        attributes: { exclude: ['password'] }
      }
    });

    return userData;
  };

  /**
   * Store user data
   *
   * @param {Object} data User data
   * @param {String} username User username data
   *
   * @return {Object}
   *
   */
  const storeUser = async (data) => {
    const userData = { ...data };
    if (userData.password === null) {
      delete userData.password;
    }

    const transaction = await User.sequelize.transaction();

    // eslint-disable-next-line no-unused-vars
    let createdUser;
    try {
      [createdUser] = await User.create(userData, { transaction });
    } catch (err) {
      if (err.status === 422 && err.errors[0].path === 'username') {
        throw new UserAlreadyUsedError({ details: 'Login Name has been registered. Please contact administrator' });
      }
      if (err.status === 422 && err.errors[0].path === 'mail') {
        throw new UserAlreadyUsedError({ details: 'Email has been registered. Please contact administrator' });
      }
      throw err;
    }
    transaction.commit();

    return createdUser;
  };

  /**
   * Update user by Id
   *
   * @param {Number} id User Id
   * @param {Object} data User data
   * @param {String} username User username data
   *
   * @return {Object}
   *
   */
  const updateUser = async (id, data, username) => {
    const userData = { ...data };

    userData.updated_at = getTimestampString(new Date());
    userData.updated_by = username;

    const transaction = await User.sequelize.transaction();

    let result;
    try {
      result = await User.update(userData, {
        findOptions: {
          where: { id },
          transaction
        }
      });
    } catch (err) {
      if (err.status === 422 && err.errors[0].path === 'username') {
        throw new UserAlreadyUsedError({ details: 'Login Name has been registered. Please contact administrator' });
      }
      if (err.status === 422 && err.errors[0].path === 'mail') {
        throw new UserAlreadyUsedError({ details: 'Email has been registered. Please contact administrator' });
      }
      throw err;
    }

    transaction.commit();

    return result;
  };

  /**
   * Delete user
   *
   * @param {Integer} id User id
   *
   * @return {Object}
   *
   */
  const deleteUser = async (id) => {
    const totalDeleted = await User.destroy(id);

    return totalDeleted;
  };

  return {
    getUserByUsername,
    getAllUsername,
    getAllUsers,
    getDetailUser,
    storeUser,
    updateUser,
    deleteUser
  };
};

export default UsersService;
