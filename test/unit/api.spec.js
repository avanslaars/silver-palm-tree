'use strict';

const chai = require('chai')
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const proxyquire = require('proxyquire');
const expect = chai.expect;

const mockRedisClient = {
  get:function(key, cb){}
};

const mockRedis = {
  createClient:function(){
    return mockRedisClient;
  }
}
const handlers = proxyquire('../../api-server/handlers',{'redis':mockRedis});

chai.use(sinonChai);

describe('Handlers', function() {
  let sandbox,
      req,
      res;

  beforeEach(function(done){
    sandbox = sinon.sandbox.create();
    done();
  });

  afterEach(function(done){
    sandbox.restore();
    done();
  });

  describe('selectGameById', function () {
    it('should respond with 404 for null or undefined id', function () {
      const reply = sandbox.spy();
      const request = {
        params:{}
      }
      handlers.selectGameById(request,reply)
      //TODO: Revisit how I'm testing errors
      expect(reply).to.have.been.calledWith(sinon.match.instanceOf(Error));
    });

    it('should select record with the passed id',function(){
      const idVal = '123';
      const reply = sandbox.spy();
      const request = {
        params:{
          id: idVal
        }
      }
      const rcSpy = sandbox.spy(mockRedisClient, 'get');
      handlers.selectGameById(request, reply);
      expect(rcSpy).to.have.been.calledWith(idVal);
    });

    it('should reply with a 404 if the record cannot be found',function(){
      const idVal = '123';
      const reply = sandbox.spy();
      const request = {
        params:{
          id: idVal
        }
      }
      sandbox.stub(mockRedisClient, 'get', function(key, callback){
        callback(null, null)
      })
      handlers.selectGameById(request, reply);
      //TODO: Revisit how I test for specific errors
      expect(reply).to.have.been.calledWith(sinon.match.instanceOf(Error));
    });

    it('should reply with a 500 if select results in error',function(){
      const idVal = '123';
      const reply = sandbox.spy();
      const request = {
        params:{
          id: idVal
        }
      }
      sandbox.stub(mockRedisClient, 'get', function(key, callback){
        callback(new Error('something broke'), null)
      })
      handlers.selectGameById(request, reply);
      //TODO: Revisit how I test for specific errors
      expect(reply).to.have.been.calledWith(sinon.match.instanceOf(Error));
    });

    it('should reply with game data for selected game',function(){
      const sampleData = {name:'sample'};
      const idVal = '123';
      const reply = sandbox.spy();
      const request = {
        params:{
          id: idVal
        }
      }
      sandbox.stub(mockRedisClient, 'get', function(key, callback){
        callback(null, sampleData)
      })
      handlers.selectGameById(request, reply);
      //TODO: Revisit how I test for specific errors
      expect(reply).to.have.been.calledWith(sampleData);
    });

    //TODO: Update this as I go to create happy path test...
    it('should not reply with 404 when id is defined', function(){
      const idVal = '123';
      const reply = sandbox.spy();
      const request = {
        params:{
          id: idVal
        }
      }
      handlers.selectGameById(request,reply)
      expect(reply).not.to.have.been.calledWith(sinon.match.instanceOf(Error));
    })

  });
});
