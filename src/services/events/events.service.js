import merge from 'deepmerge';

import { getTimestampString } from '../../utils/controllers-helper';

const EventsService = (models) => {
  const {
    Event
  } = models;

  const defaultOptions = {
    filter: {},
    paginateFilter: {},
    scopes: [],
    pagination: false
  };

  /**
   * Get all events from events table.
   *
   * @param {Object} options Options data
   *
   * @throws {DbError}
   * @throws {DbEmptyResultsError}
   *
   * @return {Array}
   *
   */
  const getAllEvents = async (options) => {
    // merge options with default options
    const opt = options ? merge(defaultOptions, options) : defaultOptions;

    if (options.paginateFilter.page && options.paginateFilter.paginate) opt.pagination = true;

    // setup query options
    let queryOptions = {
      attributes: ['id', 'title', 'description', 'person', 'start', 'end'],
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
      ? Event.findAllPaginate({ paginateOptions: queryOptions })
      : Event.findAll({ findOptions: queryOptions }));

    return results;
  };

  /**
   * Get user detail from repository
   *
   * @param {Integer} id Event id
   *
   * @return {Array}
   *
   */
  const getDetailEvent = async (id) => {
    const userData = await Event.findById(id, {
      findOptions: {
        attributes: ['id', 'title', 'description', 'person', 'start', 'end']
      }
    });

    return userData;
  };

  /**
   * Store event data
   *
   * @param {Object} data Event data
   * @param {String} username Event username data
   *
   * @return {Object}
   *
   */
  const storeEvent = async (data, username) => {
    const transaction = await Event.sequelize.transaction();

    // eslint-disable-next-line no-unused-vars
    let createdUser;
    try {
      [createdUser] = await Event.create(data, { user: username, transaction });
    } catch (err) {
      throw err;
    }
    transaction.commit();

    return data;
  };

  /**
   * Update event by Id
   *
   * @param {Number} id Event Id
   * @param {Object} data Event data
   * @param {String} username Event username data
   *
   * @return {Object}
   *
   */
  const updateEvent = async (id, data, username) => {
    const eventData = { ...data };

    eventData.updated_at = getTimestampString(new Date());
    eventData.updated_by = username;

    const transaction = await Event.sequelize.transaction();

    let result;
    try {
      result = await Event.update(eventData, {
        findOptions: {
          where: { id },
          transaction
        }
      });
    } catch (err) {
      throw err;
    }

    transaction.commit();

    return result;
  };

  /**
   * Delete event
   *
   * @param {Integer} id Event id
   *
   * @return {Object}
   *
   */
  const deleteEvent = async (id) => {
    const totalDeleted = await Event.destroy(id, { force: true });

    return totalDeleted;
  };

  return {
    getAllEvents,
    getDetailEvent,
    storeEvent,
    updateEvent,
    deleteEvent
  };
};

export default EventsService;
