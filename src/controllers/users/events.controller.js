import httpStatus from 'http-status';

/**
 * Users controller
 *
 * @param {Object} eventsService Users service
 *
 * @return {Object}
 *
 */
const EventsController = eventsService => ({
  /**
   * Get all events data.
   *
   * @param {Request} req HTTP request
   * @param {Response} res HTTP response
   * @param {NextFunction} next Next function
   *
   * @return {any}
   *
   */
  getAll: async (req, res, next) => {
    const filter = {
      search: req.query.search,
      active: req.query.active,
      sortDir: req.query.sort_dir,
      sortBy: req.query.sort_by
    };
    const paginateFilter = {
      page: req.query.page,
      paginate: req.query.limit
    };
    const { user } = req;

    try {
      // get all events
      const results = await eventsService.getAllEvents({ filter, paginateFilter }, user);
      return res.send(results); // send OK
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Get event detail data.
   *
   * @param {Request} req HTTP request
   * @param {Response} res HTTP response
   * @param {NextFunction} next Next function
   *
   * @return {any}
   *
   */
  getDetail: async (req, res, next) => {
    try {
      // get event detail
      const results = await eventsService.getDetailEvent(req.params.id);
      return res.send(results); // send OK
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Store event
   *
   * @param {Request} req HTTP request
   * @param {Response} res HTTP response
   * @param {NextFunction} next Next function
   *
   * @return {any}
   *
   */
  store: async (req, res, next) => {
    // get eventname from given token
    const { user } = req;
    try {
      // store event
      await eventsService.storeEvent(req.body, user);
      return res.sendStatus(httpStatus.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Update event by Id
   *
   * @param {Request} req HTTP request
   * @param {Response} res HTTP response
   * @param {NextFunction} next Next function
   *
   * @return {any}
   *
   */
  update: async (req, res, next) => {
    // get username from given token
    const user = req.user ? req.user.username : null;

    try {
      // update event by id
      await eventsService.updateEvent(req.params.id, req.body, user);
      return res.sendStatus(httpStatus.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Delete event
   *
   * @param {Request} req HTTP request
   * @param {Response} res HTTP response
   * @param {NextFunction} next Next function
   *
   * @return {any}
   *
   */
  delete: async (req, res, next) => {
    try {
      await eventsService.deleteEvent(req.params.id);
      return res.sendStatus(httpStatus.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  }
});

export default EventsController;
