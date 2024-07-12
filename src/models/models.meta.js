import Sequelize from 'sequelize';

const hooks = {
  // TODO: fix user hooks
  beforeCreate: (model) => {
    // if client only send createdAt, we also update the updatedAt
    if (model.created_at && !model.updated_at) {
      // eslint-disable-next-line no-param-reassign
      model.updated_at = model.created_at;
    }
  },
  beforeUpdate: (model) => {
    // eslint-disable-next-line no-param-reassign
    model.updated_at = new Date();

    // eslint-disable-next-line no-param-reassign
    model.updated_by = 'SYSTEM';
  },
  beforeDestroy: (model) => {
    // eslint-disable-next-line no-param-reassign
    model.deleted_by = 'SYSTEM';
  }
};

export function initOptions(additionalOptions) {
  return {
    timestamps: true,
    paranoid: true,
    underscored: true,
    hooks,
    ...additionalOptions
  };
}

export function initAttributes(additionalAttributes) {
  return {
    ...additionalAttributes,
    created_at: { type: Sequelize.DATE },
    created_by: {
      type: Sequelize.STRING,
      defaultValue: 'SYSTEM'
    },
    updated_at: { type: Sequelize.DATE },
    updated_by: {
      type: Sequelize.STRING,
      defaultValue: 'SYSTEM'
    },
    deleted_at: { type: Sequelize.DATE },
    deleted_by: { type: Sequelize.STRING }
  };
}
