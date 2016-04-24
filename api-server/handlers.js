'use strict';

const boom = require('boom');
const redis = require('redis');
const normalizer = require('./normalizer');
const rc = redis.createClient();

module.exports = function loadHandlers(io){

  function selectGameById(request, reply){
    const id = request.params.id;
    if(!id){
      return reply(boom.notFound());
    }
    rc.get(id, function(err, data){
      if(err){return reply(boom.badImplementation())}
      if(!data){
        return reply(boom.notFound());
      }
      data = JSON.parse(data);
      const normalizedData = normalizer.lowerNames(data);
      reply(normalizedData);
    })
  }


  function transmitGame(request, reply){
    if(!request.payload){
      return reply(boom.badRequest());
    }
    const normalizedData = normalizer.lowerNames(request.payload);
    io.sockets.emit('newGame', normalizedData);
    reply().code(201);
  }


  return {
    selectGameById,
    transmitGame
  };
}
