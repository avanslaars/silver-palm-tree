const R = require('ramda');

function lowerGameName(game){
  if(!game.name){
    return game;
  }
  const newName = game.name.toLowerCase();
  return R.merge(game, {name:newName});
}

function lowerTeamNames(game){
  if(!game.teams){
    return game;
  }
  const newTeams = game.teams.map(team => team.name ? R.merge(team, {name:team.name.toLowerCase()}) : team);
  return R.merge(game, {teams:newTeams});
}

const lowerNames = R.compose(lowerTeamNames, lowerGameName);

module.exports = {
  lowerTeamNames,
  lowerGameName,
  lowerNames
};
