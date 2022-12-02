'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:matchesDataService
 * @description
 * # matchesDataService
 * Simple service to fetch matches from the db
 */

angular.module('NBAApp')
  .service('matchesDataService', function($http) {

    var fetchAllMatches = function(url) {
      return $http.get(url, {params:{"getMatches": true}});
    };

    var fetchMatchesForPlayer = function(url, playerID) {
      var sendData = {};
      sendData.playerID = parseInt(playerID);

      var sendString = encodeURIComponent(JSON.stringify(sendData));

      return $http.get(url, {params:{"getMatchesForPlayer": true, "sendData": sendString}});
    };

    return {
      fetchAllMatches: fetchAllMatches,
      fetchMatchesForPlayer: fetchMatchesForPlayer
    };

  });
