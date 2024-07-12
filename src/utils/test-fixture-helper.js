import httpMocks from 'node-mocks-http';

/**
 * Setup HTTP mock test fixture
 *
 * @param {Object} fixture Fixture object
 * @param {String} method Request method (GET, POST, PUT, DELETE)
 * @param {String} url Request url
 *
 * @return {Object}
 *
 */
export const setupHttpMock = (fixture, method, url) => {
  const request = (opt = {}) => httpMocks.createRequest({ method, url, ...opt });
  const response = () => httpMocks.createResponse();
  return { ...fixture, request, response };
};

/**
 * Tear-down HTTP mock test fixture
 *
 * @param {Object} fixture Fixture object
 *
 * @return {Object}
 *
 */
export const teardownHttpMock = (fixture) => {
  const { request, response, ...rest } = fixture;
  return rest;
};
