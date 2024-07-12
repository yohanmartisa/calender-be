import httpStatus from 'http-status';

/**
 * Users controller
 *
 * @param {Object} usersService Users service
 *
 * @return {Object}
 *
 */
const UsersController = usersService => ({
  /**
   * Get logged-in user profile
   *
   * @param {Request} req HTTP request
   * @param {Response} res HTTP response
   * @param {NextFunction} next Next function
   *
   * @return {any}
   *
   */
  getLoggedInProfile: async (req, res, next) => {
    // get username from given token
    const username = req.user ? req.user.username : null;

    try {
      // get user by username
      const results = await usersService.getUserByUsername(username);
      return res.send(results); // send OK
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Get all user's username
   *
   * @param {Request} req HTTP request
   * @param {Response} res HTTP response
   * @param {NextFunction} next Next function
   *
   * @return {any}
   *
   */
  getAllUsername: async (req, res, next) => {
    try {
      const results = await usersService.getAllUsername();
      return res.send(results); // send OK
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Get all users data.
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

    try {
      // get all users
      const results = await usersService.getAllUsers({ filter, paginateFilter });
      return res.send(results); // send OK
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Get user detail data.
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
      // get user detail
      const results = await usersService.getDetailUser(req.params.id);
      return res.send(results); // send OK
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Store user
   *
   * @param {Request} req HTTP request
   * @param {Response} res HTTP response
   * @param {NextFunction} next Next function
   *
   * @return {any}
   *
   */
  store: async (req, res, next) => {
    // get username from given token
    const user = req.user ? req.user.username : null;
    try {
      // store user
      await usersService.storeUser(req.body, user);
      return res.sendStatus(httpStatus.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Update user by Id
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
      // update user by id
      await usersService.updateUser(req.params.id, req.body, user);
      return res.sendStatus(httpStatus.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Delete user
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
      // delete group
      await usersService.deleteUser(req.params.id);
      return res.sendStatus(httpStatus.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  }
});

export default UsersController;
