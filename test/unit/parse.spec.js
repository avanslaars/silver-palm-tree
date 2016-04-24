'use strict';

const chai = require('chai')
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const mocks = require('../mocks');
const assert = chai.assert;


const handlers = proxyquire('../../parser/handlers',
  {'redis': mocks.mockRedis,
   'request': mocks.mockRequest});

sinon.assert.expose(chai.assert, { prefix: "" });

describe('Parser', function(){
  let sandbox,
      idVal,
      sampleData;

  beforeEach(function(done){
    sandbox = sinon.sandbox.create();
    idVal = '123';
    sampleData = {id:idVal, name:'sample'};
    done();
  });

  afterEach(function(done){
    sandbox.restore();
    done();
  });

  describe('sendToApi', function(){

    it('should call post with supplied data', function(){
      const postSpy = sandbox.spy(mocks.mockRequest, 'post');
      handlers.sendToApi(sampleData);
      assert.calledWith(postSpy, sinon.match.string, sinon.match({json:sampleData}));
    });

    it('should not call post for falsey data value', function(){
      const postSpy = sandbox.spy(mocks.mockRequest, 'post');
      handlers.sendToApi(undefined);
      assert.notCalled(postSpy);
    });

  });

  describe('saveData', function(){

    it('should stringify data', function(){
      const stringispy = sandbox.spy(JSON, 'stringify');
      handlers.saveData(sampleData);
      assert.calledWith(stringispy, sampleData);
    });

    it('should attempt to save stringified data', function(){
      const redisSpy = sandbox.spy(mocks.mockRedisClient, 'set');
      const stringData = JSON.stringify(sampleData);
      handlers.saveData(sampleData);
      assert.calledWith(redisSpy, idVal, stringData);
    });

    it('should not attempt to save falsey data', function(){
      const stringispy = sandbox.spy(JSON, 'stringify');
      const redisSpy = sandbox.spy(mocks.mockRedisClient, 'set');
      handlers.saveData(undefined);
      assert.notCalled(stringispy);
      assert.notCalled(redisSpy);
    });

    it('should not attempt to save data with no ID value', function(){
      delete sampleData.id;
      const stringispy = sandbox.spy(JSON, 'stringify');
      const redisSpy = sandbox.spy(mocks.mockRedisClient, 'set');
      handlers.saveData(sampleData);
      assert.notCalled(stringispy);
      assert.notCalled(redisSpy);
    });
  });
});
