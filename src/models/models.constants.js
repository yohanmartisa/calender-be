export const FOREIGN_KEY_CONSTRAINT = {
  onUpdate: 'CASCADE',
  onDelete: 'SET NULL',
  constraints: true
};

/**
 * ====================================================
 *                      MODELS
 * ====================================================
 */

// CONFIGURATION
export const CONFIGURATION_MODEL_NAME = 'Configuration';
export const CONFIGURATION_TABLE_NAME = 'configurations';


// USER
export const USER_MODEL_NAME = 'User';
export const USER_TABLE_NAME = 'users';


export const EVENT_MODEL_NAME = 'Event';
export const EVENT_TABLE_NAME = 'events';
/**
 * ====================================================
 *                   MODELS SCOPE
 * ====================================================
 */


/**
 * ====================================================
 *                 METADATA COLUMN
 * ====================================================
 */

// DEFAULT VALUE
export const SYSTEM = 'SYSTEM';
export const CREATED_AT = 'created_at';
export const CREATED_BY = 'created_by';
export const UPDATED_AT = 'updated_at';
export const UPDATED_BY = 'updated_by';
export const DELETED_AT = 'deleted_at';
export const DELETED_BY = 'deleted_by';

/**
 * ====================================================
 *                       ENUMS
 * ====================================================
 */

// USER_ROLES
export const USER_ROLES = {
  ADMIN: 'admin',
  VIEWER: 'viewer'
};
