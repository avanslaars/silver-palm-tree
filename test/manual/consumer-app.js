const io = require('socket.io-client');
const most = require('most');

const client = io("http://localhost:9001");

most.fromEvent('connect', client)
    .tap(() => console.log('Fake Client (STB) Started'))
    .drain()

most.fromEvent('newGame', client)
    .observe(console.log.bind(console))
