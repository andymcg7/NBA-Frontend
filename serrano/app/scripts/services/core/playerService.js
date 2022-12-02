'use strict';

angular.module('NBAApp')
  .service('playerService', function() {

    var players = [];
    var playersLookup = {};

    function getPlayer(id) {
      return playersLookup[id];
    }

    function activeInSingles(player) {
      return parseInt(player.singlesMatchesPlayed) > 0;
    }

    function activeInDoubles(player) {
      return parseInt(player.doublesMatchesPlayed) > 0;
    }

    function activeInMixed(player) {
      return parseInt(player.mixedMatchesPlayed) > 0;
    }

    function returnAllPlayers() {
      return players;
    }

    function setPlayers(newPlayers) {
      players = newPlayers;

      for (var i = 0 ; i < newPlayers.length ; i++) {
        playersLookup[newPlayers[i].id] = newPlayers[i];
      }
    }

    function addPlayers(newPlayers) {
      for (var i = 0 ; i < newPlayers.length ; i++) {
        if (getPlayer(newPlayers[i].id) === undefined) {
          players.push(newPlayers[i]);
          playersLookup[newPlayers[i].id] = newPlayers[i];
        }
      }
    }

    function getPlayersForClub(club, discipline, gender, includeBlank) {
      var check = function(player) {
        if (discipline === 'Mens Doubles') {
          return player.primaryClub === club && player.gender === 'Male';
        } else if (discipline === 'Ladies Doubles') {
          return player.primaryClub === club && player.gender === 'Female';
        } else {
          return (player.primaryClub === club || player.secondaryClub === club) && player.gender === gender;
        }
      };

      var sortedArray = players.filter(check).sort(compare);
      if (includeBlank) {
        var clear = {'id': -1, 'name': ''};
        sortedArray.unshift(clear);
      }
      return sortedArray;
    }

    function compare(a,b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    }

    return {
      setPlayers: setPlayers,
      addPlayers: addPlayers,
      getAllPlayers: returnAllPlayers,
      getPlayer: getPlayer,
      returnAllPlayers: returnAllPlayers,
      activeInSingles: activeInSingles,
      activeInDoubles: activeInDoubles,
      activeInMixed: activeInMixed,
      getPlayersForClub: getPlayersForClub
    };
  });
