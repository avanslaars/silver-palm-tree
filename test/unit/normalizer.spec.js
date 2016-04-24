'use strict';

const chai = require('chai')
const assert = chai.assert;

const normalizer = require('../../api-server/normalizer');

describe('normalizer', function() {
  let sampleData,
      gameName,
      teamNames,
      loweredTeams,
      loweredGame;

  beforeEach(function(done){
    gameName = "Sample Game Name";
    loweredGame = gameName.toLowerCase();
    teamNames = ['Joe', 'Beef Supreme'];
    loweredTeams = teamNames.map(n => n.toLowerCase());

    sampleData = {
        "id": "d807c97f-e006-440e-9720-ff535136f8b0",
        "name": gameName,
        "period": "0",
        "status": "Pre Event",
        "teams": [{
          "id": "81494312-bd6e-40db-a1ad-ae0eda566067",
          "name": teamNames[0],
          "score": "0"
        }, {
          "id": "fc60204c-116b-40d8-a59e-a565e54e3fda",
          "name": teamNames[1],
          "score": "0"
        }],
        "unixstamp": 433396800
      };

    done();
  });

  describe('lowerGameName', function () {
    it('should return a game object with a lowered name property', function(){
      const result = normalizer.lowerGameName(sampleData);
      assert.equal(result.name, loweredGame);
    });

    it('should return original object if name is undefined', function(){
      delete sampleData.name;
      const result = normalizer.lowerGameName(sampleData);
      assert.equal(result, sampleData);
    });
  });

  describe('lowerTeamNames', function () {
    it('should return game object with lowered team names', function(){
      const result = normalizer.lowerTeamNames(sampleData);
      assert.equal(result.teams[0].name, loweredTeams[0]);
      assert.equal(result.teams[1].name, loweredTeams[1]);
    });

    it('should return original object if teams is undefined', function(){
      delete sampleData.teams;
      const result = normalizer.lowerTeamNames(sampleData);
      assert.equal(result, sampleData);
    });

    it('should return unchanged object if teams have no names', function(){
      delete sampleData.teams[0].name;
      delete sampleData.teams[1].name;
      const result = normalizer.lowerTeamNames(sampleData);
      assert.deepEqual(result, sampleData);
    });
  });

  describe('lowerNames', function(){
    it('should lower game name and team names', function(){
      const result = normalizer.lowerNames(sampleData);
      assert.equal(result.name, loweredGame);
      assert.equal(result.teams[0].name, loweredTeams[0]);
      assert.equal(result.teams[1].name, loweredTeams[1]);
    });
  })
});
