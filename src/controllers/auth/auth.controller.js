import passport from 'passport';

import AuthError from '../../exceptions/auth-error';
import InvalidCredentialsError from '../../exceptions/invalid-credentials-error';


/**
 * Auth controller
 *
 * @return {Object}
 *
 */
const AuthController = authService => ({
  /**
   * Login
   *
   * @param {Request} req HTTP eequest
   * @param {Response} res HTTP response
   * @param {NextFunction} next Next function
   *
   * @return {any}
   *
   */
  // eslint-disable-next-line consistent-return
  login: async (req, res, next) => {
    try {
      const userLogin = await authService.getUser(req.body.username, req.body.password);
      passport.authenticate('jwt', { session: false }, async (err) => {
        const { username, mail } = userLogin;
        try {
          if (err) {
            return next(new AuthError({ error: err }));
          }
          // store user & signing the token
          const storedUser = await authService.storeUser({ username, mail });

          // generate JWT token & refresh token
          const token = authService.signToken(storedUser);
          const refreshToken = authService.signRefreshToken(storedUser);

          // save JWT refresh token to db
          await authService.saveRefreshToken(storedUser.id, refreshToken.refresh_token);

          return res.send({ ...token, ...refreshToken });
        } catch (error) {
          return next(new InvalidCredentialsError({ error }));
        }
      })(req, res);
    } catch (err) {
      return next(new InvalidCredentialsError({ error: err }));
    }
  },

  /**
   * Get access token based on refresh token
   *
   * @param {Request} req HTTP request
   * @param {Response} res HTTP response
   * @param {NextFunction} next Next function
   *
   * @return {any}
   *
   */
  getToken: async (req, res, next) => {
    try {
      // validate refresh token
      const results = await authService.validateRefreshToken(req.query.refresh_token);

      // generate new JWT token, then return it
      const jwtToken = authService.signToken(results);
      return res.send(jwtToken);
    } catch (error) {
      return next(error);
    }
  }
});

export default AuthController;
