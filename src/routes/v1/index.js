import { Router } from 'express';

import AuthRouter from './auth.router';
import UsersRouter from './users.router';
import EventRouter from './events.router';
import {
  API_AUTH_URI_ROOT,
  API_USER_URI_ROOT,
  API_STATUS_URI_ROOT,
  API_EVENT_URI_ROOT
} from './routes.constants';

const router = Router();
router.get(API_STATUS_URI_ROOT, (req, res) => res.send('OK'));

router.use(API_AUTH_URI_ROOT, AuthRouter);
router.use(API_USER_URI_ROOT, UsersRouter);
router.use(API_EVENT_URI_ROOT, EventRouter);


export default router;
