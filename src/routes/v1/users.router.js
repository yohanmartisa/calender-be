import passport from 'passport';
import { Router } from 'express';

import {
  API_DEFAULTS,
  API_USER_URI_GET_PROFILE,
  API_USER_URI_GET_USERNAME
} from './routes.constants';
import UsersService from '../../services/users/users.service';
import Controller from '../../controllers/users/users.controller';
import UserRepository from '../../repositories/user/user.repository';

// initialize dependencies
const userRepository = new UserRepository();
const usersService = UsersService(
  {
    User: userRepository
  }
);

// initialize controller
const router = Router();
const controller = Controller(usersService);

// [GET] get logged-in user profile
router
  .route(API_USER_URI_GET_PROFILE)
  .get(
    passport.authenticate('jwt', { session: false }),
    controller.getLoggedInProfile
  );

// [GET] get all user's username
router
  .route(API_USER_URI_GET_USERNAME)
  .get(
    passport.authenticate('jwt', { session: false }),
    controller.getAllUsername
  );

// [GET] get all users
router
  .route(API_DEFAULTS.GET_ALL)
  .get(
    passport.authenticate('jwt', { session: false }),
    controller.getAll
  );

// [GET] get user detail
router
  .route(API_DEFAULTS.GET_BY_ID)
  .get(
    passport.authenticate('jwt', { session: false }),
    controller.getDetail
  );

// [POST] store user
router
  .route(API_DEFAULTS.STORE)
  .post(
    controller.store
  );

// [PUT] update user
router
  .route(API_DEFAULTS.UPDATE)
  .put(
    // TODO: add validation
    passport.authenticate('jwt', { session: false }),
    controller.update
  );

// [DELETE] delete user
router
  .route(API_DEFAULTS.DESTROY)
  .delete(
    // TODO: add validation
    passport.authenticate('jwt', { session: false }),
    controller.delete
  );

export default router;
