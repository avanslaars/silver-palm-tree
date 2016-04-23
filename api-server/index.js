const Hapi = require('hapi');
const handlers = require('./handlers');
const server = new Hapi.Server();

server.route({
    method: 'GET',
    path: '/{id}',
    handler: function (request, reply) {
        console.log('Get Request with ID: ', request.params.id);
        // rc.get(request.params.id, function(err, data){
        //   console.log('responding to get with', data);
        //   reply(data);
        // })
    }
});

server.route({
    method: 'POST',
    path: '/',
    handler: function(request, reply){
      console.log('API POST Recieved', request.payload);
      // io.sockets.emit('new_SPORTSBall', request.payload)
      reply(200)
    }
});
