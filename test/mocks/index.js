const sinon = require('sinon');
const identity = (val) => val;
const noop = () => undefined;

const mockRedisClient = {
  get:noop,
  set:noop
};

const mockRedis = { createClient: () => mockRedisClient };

const mockBoom = {
  badRequest: () => new Error('400'),
  notFound: () => new Error('404'),
  badImplementation: () => new Error('500')
};

const mockNormalizer = {
  lowerTeamNames: identity,
  lowerGameName: identity,
  lowerNames: identity
};

const mockIo = {
  sockets:{
    emit: noop
  }
};

const mockRequest = {
  post: noop
};

module.exports = {
  mockRedis,
  mockRedisClient,
  mockBoom,
  mockNormalizer,
  mockIo,
  mockRequest
};
