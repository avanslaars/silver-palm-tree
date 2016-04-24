'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
server.connection({port:8080});
const io = require('socket.io')(server.listener);

function handleClient(socket) {
  console.log('connection made... sending test record.');
  socket.emit('sportBall', {
    "id": "d807c97f-e006-440e-9720-ff535136f8b0",
    "name": "Brawndo Classic SPORTSBall 1000",
    "period": "0",
    "status": "Pre Event",
    "teams": [{
      "id": "81494312-bd6e-40db-a1ad-ae0eda566067",
      "name": "Joe",
      "score": "0"
    }, {
      "id": "fc60204c-116b-40d8-a59e-a565e54e3fda",
      "name": "Beef Supreme",
      "score": "0"
    }],
    "unixstamp": 433396800
  });
}

io.on('connection', handleClient);

server.start(() => console.log('Feeder app running'));
