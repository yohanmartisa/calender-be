import jwt from 'jsonwebtoken';

import Config from '../../../config/index';
import * as UserTransformator from '../../repositories/user/user-transformator.helper';
import InvalidCredentialsError from '../../exceptions/invalid-credentials-error';

const { jwtSecret, jwtExpirationInterval, jwtRefreshTokenExpiration } = Config.get('/');

const AuthService = (UserRepository) => {
  /**
   * Store user into users table.
   *
   * @param {Object} data User data
   *
   * @return {Object}
   *
   */
  const storeUser = async (data) => {
    const userData = UserTransformator.toUserModel(data);
    console.log('sedang cek data');
    console.log(data);
    const datauser = await UserRepository.findByUsername(data.username);
    console.log(datauser);
    const storedUser = await UserRepository.updateOrCreate(userData, {
      findOptions: { where: { username: userData.username }, raw: true }
    });
    return storedUser;
  };

  /**
   * Sign-in token based on user data
   *
   * @param {Object} user User data
   *
   * @return {Object}
   *
   */
  const signToken = (user) => {
    const payload = { sub: user.username, id: user.id };
    const accessToken = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpirationInterval });
    return { access_token: accessToken };
  };

  /**
   * Sign-in refresh token based on user data
   *
   * @param {Object} user User data
   *
   * @return {Object}
   *
   */
  const signRefreshToken = (user) => {
    const payload = { sub: user.username, id: user.id };
    // TODO: change jwtSecret to jwtRefreshTokenSecret
    const refreshToken = jwt.sign(payload, jwtSecret, { expiresIn: jwtRefreshTokenExpiration });
    return { refresh_token: refreshToken };
  };

  /**
   * Save refresh token based on user id
   *
   * @param {String} userId User's Id
   * @param {String} refreshToken Refresh token
   *
   * @throws {DbError}
   * @throws {DbValidationError}
   * @throws {DbEmptyResultError}
   *
   * @return {Object}
   *
   */
  const saveRefreshToken = async (userId, refreshToken) => {
    const result = await UserRepository.update({
      refresh_token: refreshToken
    }, {
      findOptions: {
        where: { id: userId }, returning: true
      }
    });
    const storedUser = result || null;

    return storedUser;
  };

  /**
   * Verify refresh token
   *
   * @param {String} token Refresh token
   *
   * @return {Object}
   *
   */
  // TODO: change jwtSecret to jwtRefreshTokenSecret
  const verifyRefreshToken = token => jwt.verify(token, jwtSecret);

  /**
   * Check if refresh token is valid
   *
   * @param {String} refreshToken Refresh token
   *
   * @throws {DbError}
   * @throws {JwtVerifyError}
   * @throws {JwtInvalidRefreshToken}
   *
   * @return {Object}
   *
   */
  const validateRefreshToken = async (refreshToken) => {
    // check refresh token expired timestamp
    let username = null;
    try {
      const decoded = verifyRefreshToken(refreshToken);
      username = decoded.sub;
    } catch (error) {
      throw new Error(error);
    }

    // get user by user's id in refresh token
    const user = await UserRepository.findByUsername(username);

    // check refresh token against user's refresh token
    if (!user || (user.refresh_token !== refreshToken)) {
      throw new Error(`Invalid refresh token for ${username}`);
    }

    return { username };
  };

  /**
   * Get user.
   *
   * @param {Object} data User data
   *
   * @return {Object}
   *
   */
  const getUser = async (username, password) => {
    try {
      const datauser = await UserRepository.findByUsername(username);

      if (datauser.is_active_repository === false) {
        const valid = await UserRepository.validateUsernamePassword(username, password);

        if (datauser && valid) {
          return datauser;
        }
      }
      if (datauser) {
        return datauser;
      }
      throw new InvalidCredentialsError({ error: 'User not registered!' });
    } catch (err) {
      throw err;
    }
  };

  return {
    storeUser,
    signToken,
    signRefreshToken,
    saveRefreshToken,
    validateRefreshToken,
    getUser
  };
};

export default AuthService;
