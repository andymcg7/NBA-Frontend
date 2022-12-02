'use strict';

angular.module('NBAApp')
  .service('matchesService', function() {
    var matches = [];
    var gotAllMatches = false;
    var playerIDArray = [];
    var playerMatchArray = [];

    function hasPlayersMatches(playerID) {
      return (gotAllMatches || playerIDArray.indexOf(playerID) !== -1);
    }

    function mergeMatchData(newMatches) {
      for (var i = 0 ; i < newMatches.length ; i++) {
        if (Array.isArray(newMatches[i])) {
          for (var j = 0 ; j < newMatches[i].length ; j++) {
            if (!alreadyHasMatch(newMatches[i][j])) {
              matches.push(newMatches[i][j]);
            }
          }
        } else if (!alreadyHasMatch(newMatches[i])) {
          matches.push(newMatches[i]);
        }
      }
    }

    function alreadyHasMatch(match) {
      for (var i = 0 ; i < matches.length ; i++) {
        if (matches[i].id === match.id) {
          return true;
        }
      }
      return false;
    }

    function getMatchesForPlayerFromExistingData(playerID) {
      playerMatchArray = [];

      for (var i = 0; i < matches.length; i++) {
        if (matches[i].matchPlayed === 'true' && matches[i].approved === 'yes' && (matches[i].player1 === playerID || matches[i].partner1 === playerID || matches[i].player2 === playerID || matches[i].partner2 === playerID)) {
          playerMatchArray.push(matches[i]);
        }
      }
      return playerMatchArray;
    }

    function returnMatches() {
      return matches;
    }

    function returnPlayerMatches() {
      return playerMatchArray;
    }

    function setMatches(newMatches) {
      matches = newMatches;
      gotAllMatches = true;
    }

    function setMatchesForPlayer(newMatches, playerID) {
      playerIDArray.push(playerID);
      mergeMatchData(newMatches);
      getMatchesForPlayerFromExistingData(playerID);
    }

    function addMatches(newMatches) {
      mergeMatchData(newMatches);
    }

    function getMatch(matchID) {
      for (var i = 0 ; i < matches.length ; i++) {
        if (matches[i].id === matchID) {
          return matches[i];
        }
      }
      return undefined;
    }

    return {
      setMatches: setMatches,
      addMatches: addMatches,
      setMatchesForPlayer: setMatchesForPlayer,
      hasPlayersMatches: hasPlayersMatches,
      getMatchesForPlayerFromExistingData: getMatchesForPlayerFromExistingData,
      returnMatches: returnMatches,
      returnPlayerMatches: returnPlayerMatches,
      getMatch: getMatch
    };
  });
