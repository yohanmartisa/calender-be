import passport from 'passport';
import { Router } from 'express';

import {
  API_DEFAULTS
} from './routes.constants';
import EventsService from '../../services/events/events.service';
import Controller from '../../controllers/users/events.controller';
import EventRepository from '../../repositories/event/event.repository';

// initialize dependencies
const eventRepository = new EventRepository();
const eventsService = EventsService(
  {
    Event: eventRepository
  }
);

// initialize controller
const router = Router();
const controller = Controller(eventsService);


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
    // TODO: add validation
    passport.authenticate('jwt', { session: false }),
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
