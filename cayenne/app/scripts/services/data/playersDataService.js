'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:playersDataService
 * @description
 * # playersDataService
 * Simple service to fetch players from the db
 */

angular.module('NBAApp')
  .service('playersDataService', function($http) {

    var fetchAllPlayers = function(url) {
      return $http.get(url, {params:{"getAllPlayers": true}});
    };

    var fetchPlayers = function(url, playersArray) {
      var dataString = encodeURIComponent(JSON.stringify(playersArray));
      return $http.get(url, {params:{"getPlayers": true, "sendData": dataString}});
    };

    return {
      fetchAllPlayers: fetchAllPlayers,
      fetchPlayers: fetchPlayers
    };

  });
