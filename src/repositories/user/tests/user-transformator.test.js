import { expect } from 'chai';

import expected from './user.expected';
import * as mockData from '../../../mocks/user.mock';
import * as Transformator from '../user-transformator.helper';

describe('User transformator', () => {
  it('should transform into user model', () => {
    const actual = Transformator.toUserModel(mockData.userObject);

    expect(actual).to.be.an('array');
    expect(actual).to.have.lengthOf(expected.userModel.length);
    expect(actual).to.deep.equal(expected.userModel);
  });
});
