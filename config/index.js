const path = require('path');
const Confidence = require('confidence');
require('dotenv').config();

const config = {
  appRoot: process.env.NODE_PATH || path.resolve(__dirname, '../'),
  host: process.env.SERVICE_HOST,
  port: process.env.SERVICE_PORT,
  env: process.env.BUILD_ENV,
  logs: process.env.NODE_ENV === 'production'
    ? /* istanbul ignore next: test will set env as `test` */ 'combined'
    : 'dev',
  dbName: process.env.DB_NAME,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbDialect: process.env.DB_DIALECT,
  dbSchema: process.env.DB_SCHEMA,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES,
  jwtRefreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION_DAYS || '3d'
};

const store = new Confidence.Store(config);

exports.get = key => store.get(key);
