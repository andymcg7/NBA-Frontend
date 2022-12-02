'use strict';

angular.module('NBAApp')
  .service('leagueMatchesService', function() {

    var leagueMatches = [];

    function setLeagueMatches(matches) {
      leagueMatches = matches;
    }

    function getLeagueMatch(matchID) {
      for (var i = 0 ; i < leagueMatches.length ; i++) {
        if (leagueMatches[i].id === matchID) {
          return leagueMatches[i];
        }
      }
      return undefined;
    }

    function getLeagueMatches() {
      var toReturn = [];
      for (var i = 0 ; i < leagueMatches.length ; i++) {
        if (leagueMatches[i].approved === 'yes') {
          toReturn.push(leagueMatches[i]);
        }
      }
      return toReturn;
    }

    function addLeagueMatches(matches) {
      if (matches.length > 1) {
        leagueMatches = matches;
      } else {
        if (getLeagueMatch(matches[0].id) === undefined) {
          leagueMatches.push(matches[0]);
        }
      }

    }

    function checkIfMatchAlreadyExists(leagueMatchToCheck) {
      // check each league match we have to see if the home and away teams match
      // don't worry about the date at the moment
      // since teams will be different for different disciplines we don't need to check
      // that either
      for (var i = 0 ; i < leagueMatches.length ; i++) {
        if (leagueMatchToCheck.homeTeam.id === leagueMatches[i].homeTeam &&
          leagueMatchToCheck.awayTeam.id === leagueMatches[i].awayTeam) {
          return true;
        }
      }

      // haven't found a match so we can return false
      return false;
    }

    return {
      setLeagueMatches: setLeagueMatches,
      getLeagueMatches: getLeagueMatches,
      getLeagueMatch: getLeagueMatch,
      addLeagueMatches: addLeagueMatches,
      checkIfMatchAlreadyExists: checkIfMatchAlreadyExists
    };
  });
