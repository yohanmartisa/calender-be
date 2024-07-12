import Joi from 'joi';
import { expect } from 'chai';
import momentTz from 'moment-timezone';
import timezoneMock from 'timezone-mock';

import { TIMEZONE, UNREGISTERED_COMPANY } from '../../app.constants';
import {
  getNumber,
  getTimestampObject,
  getTimestampString,
  getTimestampFormat,
  returnObjectOrArray,
  returnErrorObject,
  validateData,
  setDateToUTCZone,
  isTimestampSameDate,
  transformStructure,
  getCompanyName,
  geDateFilename,
  getUniqueArray
} from '../controllers-helper';

describe('ControllersHelper', () => {
  describe('getNumber', () => {
    it('should get a number', () => {
      const expected = 2;
      const actual = getNumber(2);
      expect(actual).to.equal(expected);
    });

    it('should return 0 for non-number', () => {
      expect(getNumber('2')).to.equal(0);
      expect(getNumber([1, 2, 3])).to.equal(0);
      expect(getNumber({ a: 1 })).to.equal(0);
      expect(getNumber(Object(0))).to.equal(0);
      expect(getNumber(new Date())).to.equal(0);
      expect(getNumber(new Error())).to.equal(0);
      expect(getNumber(null)).to.equal(0);
      expect(getNumber(undefined)).to.equal(0);
    });
  });

  describe('getTimestampObject', () => {
    it('should return momentjs timestamp object with default WITA timezone', () => {
      // month value in array & object is zero indexed
      const dateInputs = [
        new Date(),
        [2019, 11, 31, 22, 59, 59, 0],
        { y: 2019, M: 11, d: 31, h: 22, m: 59, s: 59, ms: 0 }, // eslint-disable-line object-curly-newline
        '2019-12-31 22:59:59',
        '2019-12-31 23:59:59+08:00'
      ];

      dateInputs.forEach((date) => {
        const expected = momentTz(date).tz(TIMEZONE);
        const actual = getTimestampObject(date);
        expect(actual).to.satisfy(o => o.isSame(expected));
      });
    });

    it('should return `null` when `value` is nullish', () => {
      const expected = null;
      const actual = getTimestampObject(null);
      expect(actual).to.equal(expected);
    });
  });

  describe('getTimestampString', () => {
    it('should return timestamp in UTC format with default WITA timezone', () => {
      // month value in array & object is zero indexed
      const dateInputs = [
        new Date(),
        [2019, 11, 31, 22, 59, 59, 0],
        { y: 2019, M: 11, d: 31, h: 22, m: 59, s: 59, ms: 0 }, // eslint-disable-line object-curly-newline
        '2019-12-31 22:59:59',
        '2019-12-31 23:59:59+08:00'
      ];

      dateInputs.forEach((date) => {
        const expected = momentTz(date).tz(TIMEZONE).format();
        const actual = getTimestampString(date);
        expect(actual).to.equal(expected);
      });
    });

    it('should return empty string when `value` is nullish', () => {
      const expected = '';
      const actual = getTimestampString(null);
      expect(actual).to.equal(expected);
    });
  });

  describe('getTimestampFormat', () => {
    it('should return timestamp in specific format', () => {
      // month value in array & object is zero indexed
      const dateInputs = [
        new Date(),
        [2019, 11, 31, 22, 59, 59, 0],
        { y: 2019, M: 11, d: 31, h: 22, m: 59, s: 59, ms: 0 }, // eslint-disable-line object-curly-newline
        '2019-12-31 22:59:59',
        '2019-12-31 23:59:59+08:00'
      ];

      dateInputs.forEach((date) => {
        const expected = momentTz(date).tz(TIMEZONE).format('YYYY-MM-DD');
        const actual = getTimestampFormat(date, 'YYYY-MM-DD');
        expect(actual).to.equal(expected);
      });
    });

    it('should return timestamp in default UTC format', () => {
      // month value in array & object is zero indexed
      const dateInputs = [
        new Date(),
        [2019, 11, 31, 22, 59, 59, 0],
        { y: 2019, M: 11, d: 31, h: 22, m: 59, s: 59, ms: 0 }, // eslint-disable-line object-curly-newline
        '2019-12-31 22:59:59',
        '2019-12-31 23:59:59+08:00'
      ];

      dateInputs.forEach((date) => {
        const expected = momentTz(date).tz(TIMEZONE).format();
        const actual = getTimestampFormat(date);
        expect(actual).to.equal(expected);
      });
    });

    it('should return empty string if when `value` is nullish', () => {
      const expected = '';
      const actual = getTimestampFormat(null);
      expect(actual).to.equal(expected);
    });
  });

  describe('returnObjectOrArray', () => {
    it('should return an array of objects when `value` length is more than 1', () => {
      const array = [{ a: 1 }, { b: 2 }];
      const actual = returnObjectOrArray(array);
      expect(actual).to.deep.equal(array);
    });

    it('should return a single object when `value` length is equal to 1', () => {
      const array = [{ a: 1 }];
      const actual = returnObjectOrArray(array);
      expect(actual).to.deep.equal(array[0]);
    });

    it('should be able to return non-array `value`', () => {
      expect(returnObjectOrArray({ a: 1 })).to.deep.equal({ a: 1 });
      expect(returnObjectOrArray(1)).to.equal(1);
      expect(returnObjectOrArray('2')).to.equal('2');
      expect(returnObjectOrArray(new Error())).to.be.an('error');
      expect(returnObjectOrArray(null)).to.equal(null);
      expect(returnObjectOrArray(undefined)).to.equal(undefined);
    });
  });

  describe('returnErrorObject', () => {
    it('should return an error object', () => {
      const error = {
        status: 0,
        statusText: 'Test Error',
        identifier: 'TEST_ERROR',
        message: 'This is test error of "Test Error (0)"',
        description: 'This is test error!'
      };
      const details = { a: 1 };
      const expected = {
        error: {
          status: error.status,
          message: error.description,
          details
        }
      };
      const actual = returnErrorObject(error, details);
      expect(actual).to.deep.equal(expected);
    });

    it('should return an error object without details', () => {
      const error = {
        status: 0,
        statusText: 'Test Error',
        identifier: 'TEST_ERROR',
        message: 'This is test error of "Test Error (0)"',
        description: 'This is test error!'
      };
      const expected = {
        error: {
          status: error.status,
          message: error.description,
          details: null
        }
      };
      const actual = returnErrorObject(error);
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('validateData', () => {
    const schema = Joi.object().keys({
      a: Joi.number().integer(),
      b: Joi.string(),
      c: Joi.object().keys({
        d: Joi.number()
      })
    });

    it('should return valid data without invalid data', () => {
      const data = { a: 1, b: '2', c: { d: 2.2 } };
      const uniqueProps = ['a', 'c.d'];
      const expected = { validData: [data], invalidData: [] };
      const actual = validateData(data, schema, uniqueProps);
      expect(actual).to.deep.equal(expected);
    });

    it('should return valid data with invalid data', () => {
      const data = [
        { a: 1, b: '2', c: { d: 2.2 } }, // valid
        { a: 1, b: 2, c: { d: 2.2 } } // invalid
      ];
      const uniqueProps = ['a', 'c.d'];
      const actual = validateData(data, schema, uniqueProps);
      expect(actual.validData[0]).to.deep.equal(data[0]);
      expect(actual.invalidData.length).to.equal(1);
      expect(actual.invalidData[0]).to.be.an('object');
      expect(actual.invalidData[0]).to.have.a.property('error');
      expect(actual.invalidData[0]).to.have.a.property('data');
      expect(actual.invalidData[0].data).to.deep.equal({ a: 1, 'c.d': 2.2 });
    });

    it('should return invalid data without unique properties', () => {
      const data = { a: 1, b: 2, c: { d: 2.2 } };
      const actual = validateData(data, schema);
      expect(actual.validData.length).to.equal(0);
      expect(actual.invalidData.length).to.equal(1);
      expect(actual.invalidData[0]).to.be.an('object');
      expect(actual.invalidData[0]).to.have.a.property('error');
      expect(actual.invalidData[0]).to.not.have.a.property('data');
    });
  });

  describe('setDateToUTCZone', () => {
    it('should set date to utc timezone', () => {
      const timestamp = '2019-09-17 20:10:11';
      const expected = '2019-09-17 08:10:11';

      const actual = setDateToUTCZone(timestamp).format('YYYY-MM-DD hh:mm:ss');
      expect(actual).to.equal(expected);
    });

    it('should return null if timestamp is invalid', () => {
      const timestamp = null;
      const expected = null;

      const actual = setDateToUTCZone(timestamp);
      expect(actual).to.equal(expected);
    });
  });

  describe('isTimestampSameDate', () => {
    beforeEach(() => {
      timezoneMock.register('UTC');
    });

    it('should return true if timestamp is in the same date', () => {
      const timestamp = '2019-09-17 00:10:11';
      const date = '2019-09-17';
      const expected = true;

      const actual = isTimestampSameDate(timestamp, date);
      expect(actual).to.equal(expected);
    });

    it('should return false if timestamp is not in the same date', () => {
      const timestamp = '2019-09-16 00:10:11';
      const date = '2019-09-17';
      const expected = false;

      const actual = isTimestampSameDate(timestamp, date);
      expect(actual).to.equal(expected);
    });
  });

  describe('transformStructure', () => {
    it('should transform data structure based on passed dictonary', () => {
      const data = [{ id: 1, name: 'name' }];
      const dictionary = { id: 'id', name: 'name' };
      const expected = [{ id: 1, name: 'name' }];

      const actual = transformStructure(data, { transformInto: 'model', dictionary });
      expect(actual).to.deep.equal(expected);
    });

    it('should transform data structure with additional keys', () => {
      const data = [{ id: 1, name: 'name' }, null];
      const dictionary = { id: 'id', name: 'name' };
      const expected = [{ id: 1, name: 'name', additional: null }];

      const actual = transformStructure(data, { transformInto: 'object', dictionary, additionalKeys: ['additional'] });
      expect(actual).to.deep.equal(expected);
    });

    it('should return data as is if transform into is not model or object', () => {
      const data = [{ id: 1, name: 'name', abcd: 'abcd' }];
      const dictionary = { id: 'id', name: 'name' };
      const expected = [{ id: 1, name: 'name', abcd: 'abcd' }];

      const actual = transformStructure(data, { transformInto: 'abcd', dictionary });
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('getCompanyName', () => {
    it('should return correct company name', () => {
      const data = 'abcd';
      const expected = 'abcd';
      const actual = getCompanyName(data);
      expect(actual).to.equal(expected);
    });

    it('should return empty string if company name is unregistered company name', () => {
      const data = UNREGISTERED_COMPANY;
      const expected = '';
      const actual = getCompanyName(data);
      expect(actual).to.equal(expected);
    });
  });

  describe('geDateFilename', () => {
    beforeEach(() => {
      timezoneMock.register('UTC');
    });

    it('should return date file name for 1 data', () => {
      const data = ['2019-09-17 00:06:00'];
      const expected = '(2019-09-17)';
      const actual = geDateFilename(data);
      expect(actual).to.equal(expected);
    });

    it('should return correct file name for multiple data with same date', () => {
      const data = ['2019-09-17 00:06:00', '2019-09-17 01:23:20'];
      const expected = '(2019-09-17)';
      const actual = geDateFilename(data);
      expect(actual).to.equal(expected);
    });

    it('should return correct file name for multiple data with different date', () => {
      const data = ['2019-09-16 00:06:00', '2019-09-17 01:23:20'];
      const expected = '(2019-09-16 - 2019-09-17)';
      const actual = geDateFilename(data);
      expect(actual).to.equal(expected);
    });
  });

  describe('getUniqueArray', () => {
    it('should return grouped array with maximum value', () => {
      const data = [
        { a: 1, b: 'a', c: 200 },
        { a: 1, b: 'a', c: 100 },
        { a: 1, b: 'a', c: 300 },
        { a: 2, b: 'b', c: 100 },
        { a: 3, b: 'c', c: 300 }
      ];
      const expected = [
        { a: 1, b: 'a', c: 300 },
        { a: 2, b: 'b', c: 100 },
        { a: 3, b: 'c', c: 300 }
      ];
      const actual = getUniqueArray(data, 'a', 'c');
      expect(actual).to.deep.equal(expected);
    });
  });
});
