import sinon from 'sinon';
import { expect } from 'chai';
import { Error as SequelizeError } from 'sequelize';

import UserRepository from '../user.repository';
import mockUser from '../../../mocks/user.model.mock';
import TestFixture from './user.fixture';
import DbError from '../../../exceptions/db-error';
import DbEmptyResultError from '../../../exceptions/db-empty-result-error';


describe('User Repository Class', () => {
  describe('Constructor & properties', () => {
    let fixture = {};

    before(() => {
      fixture = TestFixture.setupUserModel(fixture);
    });

    afterEach(() => {
      fixture = TestFixture.teardownUserModel(fixture);
    });

    it('should instantiate correctly with value assigned', () => {
      const actual = new UserRepository(fixture.userModel);

      expect(actual.model.name).to.equal(fixture.userModel.name);
    });
  });

  describe('Method findByUsername', () => {
    let fixture = { paginate: true }; const stubs = {}; const spies = {};
    const mockUsername = 'fake_user';

    before(() => {
      fixture = TestFixture.setupUserModel(fixture);
      spies.scope = sinon.spy(fixture.userModel, 'scope');
      stubs.findOne = sinon.stub(fixture.userModel, 'findOne');
    });

    beforeEach(() => {
      stubs.findOne.returns(mockUser.find(o => o.username === mockUsername));
      spies.scope.resetHistory();
    });

    afterEach(() => {
      stubs.findOne.reset();
    });

    after(() => {
      fixture = TestFixture.teardownUserModel(fixture.userModel);
      spies.scope.restore();
      stubs.findOne.restore();
    });

    it('should return user data', async () => {
      const mockRepo = new UserRepository(fixture.userModel);
      const actual = await mockRepo.findByUsername(mockUsername);
      const expected = mockUser.find(o => o.username === mockUsername);
      expect(actual).to.deep.equal(expected);
    });

    it('should throw `DbEmptyResultError` when return empty results from db', async () => {
      stubs.findOne.returns(null);
      const mockRepo = new UserRepository(fixture.userModel);
      const expected = 'No results found during querying into database.';
      await expect(mockRepo.findByUsername(mockUsername)).to.be
        .rejectedWith(DbEmptyResultError, expected);
    });

    it('should throw an error when failed to retrieve data from db', async () => {
      stubs.findOne.throws(new SequelizeError('Test Sequelize Error!'));
      const mockRepo = new UserRepository(fixture.userModel);
      const expected = 'There was a problem while querying into database.';
      await expect(mockRepo.findByUsername(mockUsername)).to.be
        .rejectedWith(DbError, expected);
    });

    it('should throw an error when unexpected error occurs', async () => {
      stubs.findOne.throws(new Error('Test Unexpected Sequelize Error!'));
      const mockRepo = new UserRepository(fixture.userModel);
      const expected = 'Test Unexpected Sequelize Error!';

      await expect(mockRepo.findByUsername(mockUsername)).to.be.rejectedWith(Error, expected);
    });
  });
});
