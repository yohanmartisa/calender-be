import { expect } from 'chai';
import {
  get,
  has,
  zipObject,
  deepClone,
  isObject,
  orderBy,
  asyncMap,
  select,
  isObjectValuesEmpty,
  capitalize
} from '../global-helper';

describe('GlobalHelper', () => {
  describe('get', () => {
    it('should get property values', () => {
      const object = { a: 1 };
      const expected = 1;
      const actual = get(object, 'a');
      expect(actual).to.equal(expected);
    });

    it('should get deep property values', () => {
      const object = { a: { b: 1 } };
      const expected = 1;
      const actual = get(object, 'a.b');
      expect(actual).to.equal(expected);
    });

    it('should be able to return `null` values', () => {
      const object = { a: { b: null } };
      const expected = null;
      const actual = get(object, 'a.b');
      expect(actual).to.equal(expected);
    });

    it('should return `undefined` when `object` is nullish', () => {
      const object = null;
      const expected = undefined;
      const actual = get(object, 'a');
      expect(actual).to.equal(expected);
    });

    it('should return `undefined` for deep paths when `object` is nullish', () => {
      const object = null;
      const expected = undefined;
      const actual = get(object, 'a.b');
      expect(actual).to.equal(expected);
    });

    it('should return `undefined` if parts of `path` are missing', () => {
      const object = { a: { b: null } };
      const expected = undefined;
      const actual = get(object, 'a.b.c');
      expect(actual).to.equal(expected);
    });

    it('should return the default value for `undefined` values', () => {
      const object = { a: {} };
      const expected = 'empty';
      const actual = get(object, 'a.b', 'empty');
      expect(actual).to.equal(expected);
    });
  });

  describe('has', () => {
    it('should check for own properties', () => {
      const object = { a: 1 };
      const expected = true;
      const actual = has(object, 'a');
      expect(actual).to.equal(expected);
    });

    it('should support deep paths', () => {
      const object = { a: { b: 1 } };
      const expected = true;
      const actual = has(object, 'a.b');
      expect(actual).to.equal(expected);
    });

    it('should return `false` when `object` is nullish', () => {
      const object = null;
      const expected = false;
      const actual = has(object, 'a');
      expect(actual).to.equal(expected);
    });

    it('should return `false` for deep paths when `object` is nullish', () => {
      const object = null;
      const expected = false;
      const actual = has(object, 'a.b');
      expect(actual).to.equal(expected);
    });

    it('should return `false` if parts of `path` are missing', () => {
      const object = { a: { b: null } };
      const expected = false;
      const actual = has(object, 'a.b.c');
      expect(actual).to.equal(expected);
    });
  });

  describe('zipObject', () => {
    it('should zip together key/value arrays into an object', () => {
      const keysValues = { keys: ['a', 'b'], values: [1, 2] };
      const expected = { a: 1, b: 2 };
      const actual = zipObject(keysValues.keys, keysValues.values);
      expect(actual).to.deep.equal(expected);
    });

    it('should ignore extra `values`', () => {
      const keysValues = { keys: ['a'], values: [1, 2] };
      const expected = { a: 1 };
      const actual = zipObject(keysValues.keys, keysValues.values);
      expect(actual).to.deep.equal(expected);
    });

    it('should assign `undefined` values for extra `keys`', () => {
      const keysValues = { keys: ['a', 'b'], values: [1] };
      const expected = { a: 1, b: undefined };
      const actual = zipObject(keysValues.keys, keysValues.values);
      expect(actual).to.deep.equal(expected);
    });

    it('should return empty object if no parameters passed', () => {
      const expected = {};
      const actual = zipObject();
      expect(actual).to.deep.equal(expected);
    });
  });

  describe('deepClone', () => {
    it('should deep clone object', () => {
      const object = { a: { b: { c: 1, d: undefined } } };
      const actual = deepClone(object);
      expect(actual).to.deep.equal(object);
      expect(actual).to.not.equal(object);
    });

    it('should deep clone array', () => {
      const array = [[[1, null]]];
      const actual = deepClone(array);
      expect(actual).to.deep.equal(array);
      expect(actual).to.not.equal(array);
    });

    it('should deep clone date', () => {
      const date = new Date();
      const actual = deepClone(date);
      expect(actual.toString()).to.equal(date.toString());
      expect(actual).to.not.equal(date);
    });
  });

  describe('isObject', () => {
    it('should return `true` for objects', () => {
      expect(isObject([1, 2, 3])).to.equal(true);
      expect(isObject(Object(false))).to.equal(true);
      expect(isObject(new Date())).to.equal(true);
      expect(isObject(new Error())).to.equal(true);
      expect(isObject({ a: 1 })).to.equal(true);
      expect(isObject(Object(0))).to.equal(true);
      expect(isObject(Object('a'))).to.equal(true);
    });

    it('should return `false` for non-objects', () => {
      expect(isObject(true)).to.equal(false);
      expect(isObject(1)).to.equal(false);
      expect(isObject('a')).to.equal(false);
    });
  });

  describe('orderBy', () => {
    it('should return array of object descending sorted', () => {
      const object = [{ a: 2 }, { a: 1 }, { a: 3 }];
      const expected = [{ a: 3 }, { a: 2 }, { a: 1 }];

      expect(orderBy(object, val => val.a, 'DESC')).to.deep.equal(expected);
    });

    it('should return array of object sorted by default orders', () => {
      const object = [{ a: 1 }, { a: 3 }, { a: 3 }, { a: 2 }];
      const expected = [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 3 }];

      expect(orderBy(object, val => val.a)).to.deep.equal(expected);
    });
  });

  describe('asyncMap', () => {
    it('should return array of values', async () => {
      const object = [{
        a: 'a1',
        b: 'b1'
      }, {
        a: 'a2',
        b: 'b2'
      }];
      const expected = ['a1', 'a2'];
      expect(await asyncMap(object, async data => data.a)).to.deep.equal(expected);
    });
  });

  describe('select', () => {
    it('should return array of object composed of the picked object properties', () => {
      const object = [{
        a: 'a1',
        b: 'b1'
      }, {
        a: 'a2',
        b: 'b2'
      }];
      const expected = [{
        a: 'a1',
        b: 'b1'
      }, {
        a: 'a2',
        b: 'b2'
      }];
      expect(select(object, ['a', 'b'])).to.deep.equal(expected);
    });

    it('should return passed of object if no paths parameter passed', () => {
      expect(select([{}], null)).to.deep.equal([{}]);
    });
  });

  describe('isObjectValuesEmpty', () => {
    it('should return capitalized string', () => {
      expect(isObjectValuesEmpty([null, null, null])).to.equal(true);
      expect(isObjectValuesEmpty(['', '', ''])).to.equal(true);
      expect(isObjectValuesEmpty([null, '', null])).to.equal(true);
    });

    it('should return empty string if no parameter passed', () => {
      expect(isObjectValuesEmpty(['a', 'b', 'c'])).to.equal(false);
      expect(isObjectValuesEmpty(['', 'b', ''])).to.equal(false);
      expect(isObjectValuesEmpty([null, 'b', null])).to.equal(false);
    });
  });

  describe('capitalize', () => {
    it('should return capitalized string', () => {
      expect(capitalize('abcd')).to.equal('Abcd');
    });

    it('should return empty string if no parameter passed', () => {
      expect(capitalize()).to.equal('');
    });
  });
});
