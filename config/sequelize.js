import Sequelize from 'sequelize';
import Config from './index';


const config = Config.get('/');

// initialize sequelize
const sequelize = new Sequelize(
  config.dbName,
  config.dbUsername,
  config.dbPassword,
  {
    host: config.dbHost,
    dialect: config.dbDialect,
    operatorsAliases: false,
    ssl: false
  }
);

// parse postgres decimal into float
Sequelize.postgres.DECIMAL.parse = value => parseFloat(value);
// checkConnection(sequelize);
export default sequelize;
