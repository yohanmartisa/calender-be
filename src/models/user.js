import bcrypt from 'bcrypt';
import Sequelize, { Op } from 'sequelize';
import SequelizePaginate from 'sequelize-paginate';

import Config from '../../config';
import { initAttributes, initOptions } from './models.meta';
import {
  USER_MODEL_NAME,
  USER_TABLE_NAME
} from './models.constants';

const config = Config.get('/');

const schemaAttributes = initAttributes({
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
    type: Sequelize.STRING,
    set(password) {
      this.setDataValue('password', bcrypt.hashSync(password, bcrypt.genSaltSync(8)));
    }
  },
  mail: {
    allowNull: false,
    unique: true,
    type: Sequelize.STRING
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true
  },
  refresh_token: Sequelize.STRING,
  name: Sequelize.STRING
});

const scopes = {
  withFilter: (filter) => {
    const whereClause = {};
    let orderClause = [['created_at', 'desc']];

    if (filter.active) whereClause.active = filter.active;
    if (filter.isActiveDirectory) whereClause.is_active_directory = filter.isActiveDirectory;
    if (filter.search) {
      whereClause[Op.or] = [
        {
          username: { [Op.iLike]: `%${filter.search}%` }
        },
        {
          name: { [Op.iLike]: `%${filter.search}%` }
        },
        {
          title: { [Op.iLike]: `%${filter.search}%` }
        }
      ];
    }

    if (filter.sortBy && filter.sortDir) {
      orderClause = [[filter.sortBy, filter.sortDir]];
    }

    return { where: whereClause, order: orderClause };
  }
};

const schemaOptions = initOptions({
  schema: config.dbSchema,
  tableName: USER_TABLE_NAME,
  scopes
});
const usersModel = (sequelize) => {
  const users = sequelize.define(
    USER_MODEL_NAME, schemaAttributes, schemaOptions
  );

  // eslint-disable-next-line func-names
  users.prototype.validatePassword = async function (loginpassword) {
    return bcrypt.compare(loginpassword, this.password);
  };
  // add pagination method
  SequelizePaginate.paginate(users);

  return users;
};

export default usersModel;
