import Sequelize from 'sequelize';
import Config from '../../config';

import { initAttributes, initOptions } from './models.meta';
import {
  EVENT_MODEL_NAME,
  EVENT_TABLE_NAME
} from './models.constants';

const config = Config.get('/');

const schemaAttributes = initAttributes({
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
  }
});

const schemaOptions = initOptions({
  schema: config.dbSchema,
  tableName: EVENT_TABLE_NAME
});

const eventModel = (sequelize) => {
  const event = sequelize.define(
    EVENT_MODEL_NAME, schemaAttributes, schemaOptions
  );


  return event;
};

export default eventModel;
