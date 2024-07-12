import { Error as SequelizeError } from 'sequelize';

import Models from '../../models';
import BaseRepository from '../base.repository';
import DbError from '../../exceptions/db-error';
import { USER_ATTRIBUTES } from './user.constants';
import DbEmptyResultError from '../../exceptions/db-empty-result-error';
import InvalidCredentialsError from '../../exceptions/invalid-credentials-error';

export default class UserRepository extends BaseRepository {
  constructor(model = Models.User) {
    super(model);
  }

  /**
   * Find user by username.
   *
   * @param {String} username User's username
   *
   * @throws {DbError}
   * @throws {DbEmptyResultsError}
   *
   * @return {object}
   *
   */
  async findByUsername(username) {
    try {
      // get active tugs name
      const user = await this.model.findOne({
        attributes: USER_ATTRIBUTES,
        where: { username }
      });

      if (this.isEmptyResult(user)) throw new DbEmptyResultError({ table: this.tableName });
      return user;
    } catch (error) {
      let err = error;
      if (error instanceof SequelizeError) {
        err = new DbError({ error, table: this.tableName });
      }
      throw err;
    }
  }

  /**
   * Validate username and password.
   *
   * @param {String} username User's username
   * @param {String} password User's password
   *
   * @throws {DbError}
   * @throws {DbEmptyResultsError}
   *
   * @return {object} User data if valid, or an error if not.
   */
  async validateUsernamePassword(username, password) {
    try {
      const user = await this.model.findOne({
        attributes: USER_ATTRIBUTES,
        where: { username }
      });

      if (this.isEmptyResult(user)) throw new DbEmptyResultError({ table: this.tableName });

      const isPasswordValid = await user.validatePassword(password);

      if (isPasswordValid) {
        return user;
      }
      throw new InvalidCredentialsError({ error: 'Incorrect username or password!' });
    } catch (error) {
      throw error;
    }
  }
}
