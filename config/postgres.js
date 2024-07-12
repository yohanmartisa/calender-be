require('babel-core/register');

const Config = require('.');

const config = Config.get('/');

module.exports = {
  dev: {
    username: config.dbUsername,
    password: config.dbPassword,
    database: config.dbName,
    schema: config.dbSchema,
    host: config.dbHost,
    dialect: config.dbDialect,
    port: 5432
  },
  uat: {
    username: config.dbUsername,
    password: config.dbPassword,
    database: config.dbName,
    schema: config.dbSchema,
    host: config.dbHost,
    dialect: config.dbDialect,
    port: 5432
  },
  production: {
    username: config.dbUsername,
    password: config.dbPassword,
    database: config.dbName,
    schema: config.dbSchema,
    host: config.dbHost,
    dialect: config.dbDialect,
    port: 5432
    // dialectOptions: {
    //   ssl: {
    //     require: true, // This will help you. But you will see nwe error
    //     rejectUnauthorized: false // This line will fix new error
    //   }
    // }
  }
};
