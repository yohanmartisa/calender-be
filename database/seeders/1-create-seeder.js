import Config from '../../config';

const config = Config.get('/');
const records = [
  {
    id: 1, username: 'admin', name: 'admin', password: '$2b$08$OMWOB7aF.kDBhCSRW4IF2.jU2t2hbCInIWO.WzSzEs5.k4q8glzP6', mail: 'mail@mail.com'
  }
];

export default {
  up: queryInterface => queryInterface.bulkInsert(
    {
      tableName: 'users',
      schema: config.dbSchema
    },
    records,
    {}
  ),
  down: queryInterface => queryInterface.bulkDelete(
    {
      tableName: 'users',
      schema: config.dbSchema
    },
    null,
    {}
  )
};
