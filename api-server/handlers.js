const boom = require('boom');
const redis = require('redis');
const rc = redis.createClient();

module.exports = {
  selectGameById,
  saveGame
}

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
    return reply(data)
  })
}

function saveGame(request, reply){

}
