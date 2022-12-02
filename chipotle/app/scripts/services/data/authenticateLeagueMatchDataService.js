'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:clubsDataService
 * @description
 * # clubsDataService
 * Simple service to fetch teams from the db
 */

angular.module('NBAApp')
  .service('authenticateLeagueMatchDataService', function($http) {

    var authenticateLeagueMatch = function(url, matchID, authCode) {

      var postdata = {};
      postdata.match = matchID;
      postdata.authCode = authCode;

      var dataString = JSON.stringify(postdata);

      return $http.get(url, {params:{"authenticateLeagueMatch": true, "sendData": dataString}});
    };

    return {
      authenticateLeagueMatch: authenticateLeagueMatch
    };

  });
