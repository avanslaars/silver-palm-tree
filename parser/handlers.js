'use strict';

const redis = require('redis');
const rc = redis.createClient();
const request = require('request');
const most = require('most');

function saveData(gameData){
  if(!gameData || !gameData.id){
    return;
  }
  const id = gameData.id;
  const stringData = JSON.stringify(gameData);
  rc.set(id, stringData);
}

function sendToApi(gameData){
  if(!gameData){return;}
  request.post('http://localhost:9001/', {json: gameData});
}
module.exports = {
  saveData,
  sendToApi
}
