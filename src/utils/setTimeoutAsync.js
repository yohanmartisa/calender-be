import TimeoutServerError from '../exceptions/timeout-server';

export const setTimeoutAsync = async (callback, timeout = 1200000) => new Promise(async (resolve, reject) => {
  setTimeout(() => reject(new TimeoutServerError('Timed Out')), timeout);
  resolve(callback());
});
