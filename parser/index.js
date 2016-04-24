const io = require('socket.io-client');
const most = require('most');
const handlers = require('./handlers');
const client = io("http://localhost:8080");

most.fromEvent('sportBall', client)
    .tap(handlers.saveData)
    .observe(handlers.sendToApi);

most.fromEvent('connect', client)
    .observe(() => console.log('connected to remote!'));

console.log('Parser waiting to connect');
