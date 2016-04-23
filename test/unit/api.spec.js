'use strict';

const chai = require('chai')
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.expect;
const handlers = require('../../api-server/handlers');

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
