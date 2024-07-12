import Sequelize from 'sequelize';
import Config from '../../config';
import {
  USER_TABLE_NAME
} from '../../src/models/models.constants';

const config = Config.get('/');

const schemaAttributes = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  username: {
    allowNull: false,
    unique: true,
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  mail: {
    allowNull: false,
    unique: true,
    type: Sequelize.STRING
  },
  active: Sequelize.BOOLEAN,
  refresh_token: Sequelize.STRING,
  created_at: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('NOW()')
  },
  created_by: {
    type: Sequelize.STRING,
    defaultValue: 'SYSTEM'
  },
  updated_at: {
    type: Sequelize.DATE
  },
  updated_by: {
    type: Sequelize.STRING,
    defaultValue: 'SYSTEM'
  },
  deleted_at: {
    type: Sequelize.DATE
  },
  deleted_by: {
    type: Sequelize.STRING
  }
};

const schemaOptions = {
  schema: config.dbSchema
};

export default {
  up: queryInterface => queryInterface.createTable(
    USER_TABLE_NAME,
    schemaAttributes,
    schemaOptions
  ),
  down: queryInterface => queryInterface.dropTable(USER_TABLE_NAME)
};
