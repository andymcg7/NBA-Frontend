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

    return {
      fetchAllPlayers: fetchAllPlayers
    };

  });
