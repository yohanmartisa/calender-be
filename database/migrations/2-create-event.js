import Sequelize from 'sequelize';
import Config from '../../config';
import {
  EVENT_TABLE_NAME
} from '../../src/models/models.constants';

const config = Config.get('/');

const schemaAttributes = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  title: {
    allowNull: false,
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  person: {
    type: Sequelize.STRING
  },
  start: {
    allowNull: false,
    type: Sequelize.DATE,
    defaultValue: Sequelize.literal('NOW()')
  },
  end: {
    allowNull: false,
    type: Sequelize.DATE
  },
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
    EVENT_TABLE_NAME,
    schemaAttributes,
    schemaOptions
  ),
  down: queryInterface => queryInterface.dropTable(EVENT_TABLE_NAME)
};
