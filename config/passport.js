import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

import Config from './index';

const { jwtSecret } = Config.get('/');

/**
 * Verify user from JWT token
 *
 * @param {Object} jwtPayload JWT token payload
 * @param {Function} done Callback function
 *
 * @return {Void}
 *
 */
const verifyJwt = (jwtPayload, done) => {
  // JWT payload verified
  done(null, { username: jwtPayload.sub, id: jwtPayload.id });
};

// JWT strategy
const bearerJwtStrategy = new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  secretOrKey: jwtSecret
}, verifyJwt);

export {
  bearerJwtStrategy
};
