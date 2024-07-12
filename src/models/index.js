import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import sequelize from '../../config/sequelize';

const basename = path.basename(__filename);
const excludeFiles = ['models.constants.js', 'models.meta.js'];

// Dynamically add model into db object
const db = {};
fs.readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .filter(file => !excludeFiles.includes(file))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).map((modelName) => {
  // load model associations
  if (db[modelName].associate) db[modelName].associate(db);
  return modelName;
}).map((modelName) => {
  // load model scopes
  if (db[modelName].loadScopes) db[modelName].loadScopes();
  return modelName;
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
