import merge from 'deepmerge';
import {
  Op,
  Error as SequelizeError,
  ValidationError as SequelizeValidationError
} from 'sequelize';
import Config from '../../config';

import Models from '../models';
import DbError from '../exceptions/db-error';
import RepositoryError from '../exceptions/repository-error';
import DbValidationError from '../exceptions/db-validation-error';
import DbTransactionError from '../exceptions/db-transaction-error';
import DbEmptyResultError from '../exceptions/db-empty-result-error';
import {
  REPOSITORY_ALL_MODE,
  REPOSITORY_READ_MODE,
  REPOSITORY_WRITE_MODE,
  DEFAULT_SCOPE,
  READ_ERROR_MESSAGE,
  WRITE_ERROR_MESSAGE,
  UNSUPPORTED_PAGINATION_ERROR_MESSAGE,
  UNSUPPORTED_SOFT_DELETE_ERROR_MESSAGE
} from './repository.constants';
import { transformPaginateOptions } from './base-transformator.helper';

const config = Config.get('/');

/**
 * Class representing a Base Repository.
 *
 */
export default class BaseRepository {
  /** @typedef {import('sequelize').Sequelize} Sequelize */
  /** @typedef {import('sequelize').Model} Model */
  /**
   * Creates a Base Repository.
   *
   * @param {Model} model Sequelize model.
   * @param {String} [mode = REPOSITORY_ALL_MODE] Repository mode.
   * @param {Sequelize} [sequelize = Models.sequelize] Sequelize.
   *
   */
  constructor(model, mode = REPOSITORY_ALL_MODE, sequelize = Models.sequelize) {
    this.model = model;
    this.mode = mode;
    this.sequelize = sequelize;
  }

  /**
   * Table name.
   *
   * @type {String}
   *
   */
  get tableName() {
    const tableNameObj = this.model.getTableName();
    return `${tableNameObj.schema}.${tableNameObj.tableName}`;
  }

  /**
   * Model scopes.
   *
   * @type {Object}
   *
   */
  get scopes() {
    return this.model.options.scopes;
  }

  /**
   * Is repository allowed to read data.
   *
   * @type {Boolean}
   *
   */
  get isReadAllowed() {
    return this.mode === REPOSITORY_READ_MODE || this.mode === REPOSITORY_ALL_MODE;
  }

  /**
   * Is repository allowed to write data, include deleting data.
   *
   * @type {Boolean}
   *
   */
  get isWriteAllowed() {
    return this.mode === REPOSITORY_WRITE_MODE || this.mode === REPOSITORY_ALL_MODE;
  }

  /**
   * Checks if given data is empty.
   *
   * @param {Object|Array} data The data to check
   *
   * @return {Boolean}
   *
   */
  isEmptyResult(data) {
    // TODO: move to helper
    return !data || (Array.isArray(data) ? data.length === 0 : false);
  }

  /**
   * Throw Repository Error with given error message
   *
   * @param {String} message Given error message
   *
   * @throws {RepositoryError}
   *
   */
  throwRepositoryError(message) {
    throw new RepositoryError({
      error: new Error(message),
      domainObject: this.model.name
    });
  }

  /** @typedef {import('sequelize').FindOptions} FindOptions */
  /**
   * Find all of model instances.
   *
   * @param {FindOptions} [options.findOptions = {}] Find options
   * @param {Array} [options.scopes = []] Model scopes
   *
   * @throws {DbError}
   * @throws {DbEmptyResultsError}
   *
   * @return {Array}
   *
   */
  async findAll(options) {
    if (!this.isReadAllowed) this.throwRepositoryError(READ_ERROR_MESSAGE);

    // default find options
    const defaultFindOptions = {
      findOptions: {},
      scopes: []
    };

    // merge options
    const opts = options ? merge(defaultFindOptions, options) : defaultFindOptions;
    opts.scopes.push(DEFAULT_SCOPE);

    try {
      const data = await this.model.scope(opts.scopes).findAll(opts.findOptions);
      if (this.isEmptyResult(data)
        && this.tableName !== `${config.dbSchema}.waterfleet_transaction_histories`
        && this.tableName !== `${config.dbSchema}.barge_plan_actuals`
        && this.tableName !== `${config.dbSchema}.vessel_transactions`
        && this.tableName !== `${config.dbSchema}.notification_users`
      ) throw new DbEmptyResultError({ table: this.tableName });
      return data;
    } catch (error) {
      let err = error;
      if (error instanceof SequelizeError) {
        err = new DbError({ error, table: this.tableName });
      }
      throw err;
    }
  }

  /**
   * Find all of model instances with pagination.
   *
   * @param {PaginateOptions} [options.paginateOptions = {}] Find options with pagination
   * @param {Array} [options.scopes = []] Model scopes
   *
   * @throws {DbError}
   * @throws {DbEmptyResultsError}
   *
   * @return {Object}
   *
   */
  async findAllPaginate(options) {
    if (!this.isReadAllowed) this.throwRepositoryError(READ_ERROR_MESSAGE);
    if (!this.model.paginate) this.throwRepositoryError(UNSUPPORTED_PAGINATION_ERROR_MESSAGE);

    // default pagination options
    const defaultPaginateOptions = {
      paginateOptions: { offset: 0, limit: 10 },
      scopes: []
    };

    // merge options
    const opts = options ? merge(defaultPaginateOptions, options) : defaultPaginateOptions;
    if (!opts.paginateOptions) opts.paginateOptions = defaultPaginateOptions.paginateOptions;
    opts.scopes.push(DEFAULT_SCOPE);

    opts.paginateOptions = transformPaginateOptions(opts);
    try {
      const { rows, count } = await this.model.scope(opts.scopes).findAndCountAll(opts.paginateOptions);
      const { docs, pages, total } = { docs: rows, pages: Math.ceil(count / opts.paginateOptions.limit), total: count };

      if (this.isEmptyResult(docs)) throw new DbEmptyResultError({ table: this.tableName });
      return { data: docs, pages, total };
    } catch (error) {
      let err = error;
      if (error instanceof SequelizeError) {
        err = new DbError({ error, table: this.tableName });
      }
      throw err;
    }
  }

  /**
   * Find a model instance by Id.
   *
   * @param {Number} id Model instance Id
   * @param {FindOptions} [options.findOptions = {}] Find options
   *
   * @throws {DbError}
   * @throws {DbEmptyResultsError}
   *
   * @return {Object}
   *
   */
  async findById(id, options) {
    if (!this.isReadAllowed) this.throwRepositoryError(READ_ERROR_MESSAGE);

    try {
      const data = await this.model.findByPk(id, options.findOptions);
      if (this.isEmptyResult(data)) throw new DbEmptyResultError({ table: this.tableName });
      return data;
    } catch (error) {
      let err = error;
      if (error instanceof SequelizeError) {
        err = new DbError({ error, table: this.tableName });
      }
      throw err;
    }
  }

  /**
   * Find model instance based on criteria, or create the model instance
   * if none is found.
   *
   * @param {Object} data Data to create
   * @param {FindOptions} [options.findOptions = {}] Find options
   * @param {Boolean} [options.native = true]
   *
   * @throws {DbError}
   * @throws {DbTransactionError}
   * @throws {DbValidationError}
   *
   * @return {Object}
   *
   */
  async findOrCreate(data, options) {
    if (!this.isReadAllowed) this.throwRepositoryError(READ_ERROR_MESSAGE);
    if (!this.isWriteAllowed) this.throwRepositoryError(WRITE_ERROR_MESSAGE);

    // default find options
    const defaultFindOrCreateOptions = {
      findOptions: {},
      native: true
    };

    // merge options
    const opts = options ? merge(defaultFindOrCreateOptions, options) : defaultFindOrCreateOptions;

    try {
      if (opts.native) {
        // using native sequelize `findOrCreate` function.
        // In `postgres` dialect, `findOrCreate` will using `pg_temp` function
        const findOrCreateOptions = { ...opts.findOptions, defaults: data };
        const [stored] = await this.model.findOrCreate(findOrCreateOptions);
        return stored;
      }

      const stored = await this.sequelize.transaction(async (transaction) => {
        // find model instance based on criteria
        const findOneOptions = { ...opts.findOptions, transaction };
        let tempData = await this.model.findOne(findOneOptions);

        if (this.isEmptyResult(tempData)) {
          // create a new model instance
          const createOptions = { transaction, returning: true };
          tempData = await this.model.create(data, createOptions);
        }

        return tempData;
      });

      return stored;
    } catch (error) {
      // throw the error
      let err = error;
      if (error instanceof SequelizeValidationError) {
        err = new DbValidationError({ error, table: this.tableName });
      } else if (error instanceof SequelizeError) {
        err = opts.native ? new DbError({ error, table: this.tableName })
          : new DbTransactionError({ error, table: this.tableName });
      }
      throw err;
    }
  }

  /**
   * Update model instance based on criteria, or create the model instance
   * if none is found.
   *
   * @param {Object} data Data to update or create
   * @param {FindOptions} [options.findOptions = {}] Find options
   *
   * @throws {DbError}
   * @throws {DbTransactionError}
   * @throws {DbValidationError}
   *
   * @return {Object}
   *
   */
  async updateOrCreate(data, options) {
    if (!this.isReadAllowed) this.throwRepositoryError(READ_ERROR_MESSAGE);
    if (!this.isWriteAllowed) this.throwRepositoryError(WRITE_ERROR_MESSAGE);

    // default find options
    const defaultUpdateOrCreateOptions = { findOptions: {} };

    // merge options
    const opts = options ? merge(defaultUpdateOrCreateOptions, options) : defaultUpdateOrCreateOptions;

    try {
      const stored = await this.sequelize.transaction(async (transaction) => {
        // find model instance based on criteria
        const findOneOptions = { ...opts.findOptions, transaction };
        let tempData = await this.model.findOne(findOneOptions);

        if (this.isEmptyResult(tempData)) {
          // create a new model instance
          const createOptions = { transaction, returning: true };
          tempData = await this.model.create(data, createOptions);
        } else {
          // update model instance
          const updateOptions = { transaction, ...opts.findOptions, returning: true };
          [, [tempData]] = await this.model.update(data, updateOptions);
        }

        return tempData;
      });

      return stored;
    } catch (error) {
      // throw the error
      let err = error;
      if (error instanceof SequelizeValidationError) {
        err = new DbValidationError({ error, table: this.tableName });
      } else if (error instanceof SequelizeError) {
        err = new DbTransactionError({ error, table: this.tableName });
      }
      throw err;
    }
  }

  /**
   * Create a new model instance(s).
   *
   * @param {Object|Array} data Data to create
   * @param {Object} options Options
   *
   * @throws {DbError}
   * @throws {DbValidationError}
   *
   * @return {Array}
   *
   */
  async create(data, options) {
    if (!this.isWriteAllowed) this.throwRepositoryError(WRITE_ERROR_MESSAGE);
    const opts = { returning: true, ...options };
    const records = !Array.isArray(data) ? [data] : data;

    try {
      const createdData = await this.model.bulkCreate(records, opts);
      return createdData;
    } catch (error) {
      let err = error;
      const errData = { error, table: this.tableName };
      if (error instanceof SequelizeValidationError) {
        err = new DbValidationError(errData);
      } else if (error instanceof SequelizeError) {
        err = new DbError(errData);
      }
      throw err;
    }
  }

  /**
   * Update a model instance(s) based on criteria.
   *
   * @param {Object} data Data to update
   * @param {FindOptions} [options.findOptions = {}] Find options
   *
   * @throws {DbError}
   * @throws {DbValidationError}
   *
   * @return {Object}
   *
   */
  async update(data, options) {
    if (!this.isWriteAllowed) this.throwRepositoryError(WRITE_ERROR_MESSAGE);

    // default update options
    const defaultUpdateOptions = {
      findOptions: { returning: true }
    };

    // merge options
    const opts = options ? { ...defaultUpdateOptions, ...options } : defaultUpdateOptions;
    opts.findOptions = { ...defaultUpdateOptions.findOptions, ...opts.findOptions };

    try {
      const [totalUpdatedData, updatedData] = await this.model.update(data, opts.findOptions);
      return totalUpdatedData >= 1 ? updatedData[0] : null;
    } catch (error) {
      let err = error;
      const errData = { error, table: this.tableName };
      if (error instanceof SequelizeValidationError) {
        err = new DbValidationError(errData);
      } else if (error instanceof SequelizeError) {
        err = new DbError(errData);
      }
      throw err;
    }
  }

  /**
   * Delete a model instance by Id.
   *
   * @param {Number} id Model instance Id
   * @param {Object} options Options
   *
   * @throws {DbError}
   *
   * @return {Number}
   *
   */
  async destroy(id, options) {
    if (!this.isWriteAllowed) this.throwRepositoryError(WRITE_ERROR_MESSAGE);
    const opts = { where: { id }, ...options };

    try {
      const totalDeleted = await this.model.destroy(opts);
      return totalDeleted;
    } catch (error) {
      let err = error;
      if (error instanceof SequelizeError) {
        err = new DbError({ error, table: this.tableName });
      }
      throw err;
    }
  }

  /**
   * Delete a model instance by Id.
   *
   * @param {Number} id Model instance Id
   * @param {Object} options Options
   *
   * @throws {DbError}
   *
   * @return {Number}
   *
   */
  async bulkDestroy(id, options) {
    if (!this.isWriteAllowed) this.throwRepositoryError(WRITE_ERROR_MESSAGE);
    const opts = { where: { id: { [Op.in]: id } }, ...options };

    try {
      const totalDeleted = await this.model.destroy(opts);
      return totalDeleted;
    } catch (error) {
      let err = error;
      if (error instanceof SequelizeError) {
        err = new DbError({ error, table: this.tableName });
      }
      throw err;
    }
  }

  /**
   * Spft delete a model instance by Id.
   *
   * @param {Number} id Model instance Id
   *
   * @throws {DbError}
   *
   * @return {Number}
   *
   */
  async softDestroy(id) {
    if (!this.isWriteAllowed) this.throwRepositoryError(WRITE_ERROR_MESSAGE);
    if (!this.model.softDelete) this.throwRepositoryError(UNSUPPORTED_SOFT_DELETE_ERROR_MESSAGE);
    const options = { where: { id } };

    try {
      const totalDeleted = await this.model.softDelete(options);
      return totalDeleted;
    } catch (error) {
      let err = error;
      if (error instanceof SequelizeError) {
        err = new DbError({ error, table: this.tableName });
      }
      throw err;
    }
  }
}
