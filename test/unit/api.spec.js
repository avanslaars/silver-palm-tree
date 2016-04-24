'use strict';

const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const mocks = require('../mocks');
const assert = chai.assert;

const handlers = proxyquire('../../api-server/handlers',
  {'redis': mocks.mockRedis,
   'boom': mocks.mockBoom,
   './normalizer': mocks.mockNormalizer})(mocks.mockIo);

sinon.assert.expose(chai.assert, { prefix: "" });

const mockBoom = mocks.mockBoom;
const mockRedisClient = mocks.mockRedisClient;
const mockNormalizer = mocks.mockNormalizer;
const mockIo = mocks.mockIo;

describe('Handlers', function() {
  let sandbox,
      request,
      reply,
      idVal,
      sampleData;

  beforeEach(function(done){
    sandbox = sinon.sandbox.create();
    reply = sandbox.spy();
    idVal = '123';
    sampleData = {name:'sample'};
    done();
  });

  afterEach(function(done){
    sandbox.restore();
    done();
  });

  describe('selectGameById', function () {

    beforeEach(function(done){
      request = {
        params:{
          id: idVal
        }
      };
      done();
    });

    it('should respond with 404 for falsey id', function () {
      delete request.params.id;
      handlers.selectGameById(request,reply);
      assert.calledWith(reply, mockBoom.notFound());
    });

    it('should select record with the passed id',function(){
      const rcSpy = sandbox.spy(mockRedisClient, 'get');
      handlers.selectGameById(request, reply);
      assert.calledWith(rcSpy, idVal);
    });

    it('should reply with a 404 if the record cannot be found',function(){
      sandbox.stub(mockRedisClient, 'get', function(key, callback){
        callback(null, null);
      });
      handlers.selectGameById(request, reply);
      assert.calledWith(reply, mockBoom.notFound());
    });

    it('should reply with a 500 if select results in error',function(){
      sandbox.stub(mockRedisClient, 'get', function(key, callback){
        callback(new Error('something broke'), null);
      })
      handlers.selectGameById(request, reply);
      assert.calledWith(reply, mockBoom.badImplementation());
    });

    it('should parse and call normalizer with selected data', function(){
      const stringifiedData = JSON.stringify(sampleData);
      const parseSpy = sinon.spy(JSON, 'parse');
      sandbox.stub(mocks.mockRedisClient, 'get', function(key, callback){
        callback(null, stringifiedData);
      });
      const normSpy = sandbox.spy(mockNormalizer, 'lowerNames');
      handlers.selectGameById(request, reply);

      assert.calledWith(parseSpy, stringifiedData);
      assert.calledWith(normSpy, sampleData);
    });

    it('should reply with game data for selected game',function(){
      sandbox.stub(mocks.mockRedisClient, 'get', function(key, callback){
        callback(null, JSON.stringify(sampleData));
      });
      const result = handlers.selectGameById(request, reply);
      assert.calledWith(reply, sinon.match(sampleData));
    });
  });

  describe('transmitGame', function(){
    let handler;

    beforeEach(function(done){
      request = {
        payload: sampleData
      };
      reply = function(){
        return {code: ()=> undefined}
      };
      done();
    });

    it('should reply with a 400 for no game', function(){
      delete request.payload;
      reply = sandbox.spy();
      handlers.transmitGame(request, reply);
      assert.calledWith(reply, mockBoom.badRequest());
    });

    it('should normalize game data payload', function(){
      const normSpy = sandbox.spy(mockNormalizer, 'lowerNames');
      handlers.transmitGame(request, reply);
      assert.calledWith(normSpy, sampleData);
    });

    it('should emit normalizedData to socket', function(){
      const socketSpy = sandbox.spy(mockIo.sockets, 'emit');
      handlers.transmitGame(request, reply);
      assert.calledWith(socketSpy, 'newGame', sampleData);
    });

    it('should reply with a 201 for success', function(){
      const codeSpy = sandbox.spy();
      reply = function reply(){
        return {code: codeSpy}
      };
      handlers.transmitGame(request, reply);
      assert.calledWith(codeSpy, 201);
    });
  });
});
