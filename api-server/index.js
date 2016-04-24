const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({port:9001});

const io = require('socket.io')(server.listener);
const handlers = require('./handlers')(io);


server.route({
    method: 'GET',
    path: '/{id}',
    handler: handlers.selectGameById
});

server.route({
    method: 'POST',
    path: '/',
    handler: handlers.transmitGame
});

io.on('connection', () => console.log('Socket client connected to API server'));
server.start(() => console.log('API Server Started at port 9001'));
