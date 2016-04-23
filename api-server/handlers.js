const boom = require('boom');

module.exports = {
  selectGameById,
  saveGame
}

function selectGameById(request, reply){
  const id = request.params.id;
  if(!id){
    return reply(boom.notFound());
  }
}

function saveGame(request, reply){

}
