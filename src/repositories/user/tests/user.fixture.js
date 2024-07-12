import SequelizeMock from 'sequelize-mock';

/**
 * Setup user model test fixture
 *
 * @param {Object} fixture Fixture object
 * @param {Sequelize} sequelizeMock Sequelize mock object
 *
 * @return {Object}
 *
 */
const setupUserModel = (fixture, sequelizeMock = new SequelizeMock()) => {
  const UserModel = sequelizeMock.define('User', {}, { timestamps: false });

  return { ...fixture, userModel: UserModel };
};

/**
 * Tear-down user model test fixture
 *
 * @param {Object} fixture Fixture object
 *
 * @return {Object}
 *
 */
const teardownUserModel = (fixture) => {
  const { userModel, ...rest } = fixture;
  return rest;
};

export default {
  setupUserModel,
  teardownUserModel
};
