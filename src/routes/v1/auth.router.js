import { Router } from 'express';

import AuthService from '../../services/auth/auth.service';
import Controller from '../../controllers/auth/auth.controller';
import UserRepository from '../../repositories/user/user.repository';

import { API_AUTH_URI_LOGIN, API_AUTH_URI_TOKEN } from './routes.constants';

// initialize dependencies
const userRepository = new UserRepository();
const authService = AuthService(userRepository);

// initialize controller
const router = Router();
const controller = Controller(authService);

// [POST] login
router
  .route(API_AUTH_URI_LOGIN)
  .post(controller.login);

// [GET] get token
router
  .route(API_AUTH_URI_TOKEN)
  .get(controller.getToken);

export default router;
