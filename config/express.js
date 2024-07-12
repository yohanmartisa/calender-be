import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';

import routes from '../src/routes/v1';
import * as errorMiddleware from '../src/middleware/error';
// import { swaggerMiddleware, swaggerUIPath } from './swagger';
import { bearerJwtStrategy } from './passport';
import { BODY_JSON_LIMIT, API_ROUTES_VERSION } from './config.constants';

const ExpressFactory = ({
  /**
   * Create server
   *
   * @param {Object} config Configuration
   *
   * @return {Express}
   *
   */
  create: (config) => {
    const app = express();

    // request logging. dev: console | production: file
    app.use(morgan(config.logs));

    // parse body params and attache them to req.body
    app.use(bodyParser.json({ limit: BODY_JSON_LIMIT }));
    app.use(bodyParser.urlencoded({ extended: true }));

    // lets you use HTTP verbs such as PUT or DELETE
    // in places where the client doesn't support it
    app.use(methodOverride());

    // secure apps by setting various HTTP headers
    app.use(helmet());

    // enable CORS - Cross Origin Resource Sharing
    app.use(cors());

    // mount passport
    app.use(passport.initialize());
    passport.use('jwt', bearerJwtStrategy);

    // mount api v1 routes
    app.use(API_ROUTES_VERSION, routes);

    // if error is not an instanceOf APIError, convert it.
    app.use(errorMiddleware.converter);

    // catch 404 and forward to error handler
    app.use(errorMiddleware.notFound);

    // error handler, send stacktrace only during development
    app.use(errorMiddleware.handler);

    return app;
  }
});

export { ExpressFactory };
