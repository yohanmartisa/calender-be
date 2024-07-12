import { expect } from 'chai';
import {
  getInfo,
  logError,
  logWarn,
  logInfo,
  log
} from '../log-helper';

describe('LogHelper', () => {
  describe('getInfo', () => {
    const infoInput = {
      info: {
        CODE: 'TEST_INFO',
        LABEL: 'Test Info',
        MESSAGE: o => `This is test info of "${o.request}"!`
      },
      url: '/test-info',
      method: 'GET',
      body: null
    };

    it('should get info message', () => {
      const request = {
        url: infoInput.url,
        method: infoInput.method,
        body: infoInput.body
      };
      const expected = `This is test info of "${JSON.stringify(request)}"!`;
      const actual = getInfo(infoInput).message;
      expect(actual).to.equal(expected);
    });
  });

  describe('logError', () => {
    it('should log an error', () => {
      logError({ label: 'Test Error', message: 'This is test error' });
      // TODO: check if log to file
    });
  });

  describe('logWarn', () => {
    it('should log a warn', () => {
      logWarn({ label: 'Test Warn', message: 'This is test warn' });
      // TODO: check if log to file
    });
  });

  describe('logInfo', () => {
    it('should log an info', () => {
      logInfo({ label: 'Test Info', message: 'This is test info' });
      // TODO: check if log to file
    });
  });

  describe('log', () => {
    it('should log a log', () => {
      log({ level: 'info', label: 'Test Log', message: 'This is test log' });
      // TODO: check if log to file
    });
  });
});
