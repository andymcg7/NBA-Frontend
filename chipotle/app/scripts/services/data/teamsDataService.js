'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:clubsDataService
 * @description
 * # clubsDataService
 * Simple service to fetch teams from the db
 */

angular.module('NBAApp')
  .service('teamsDataService', function($http) {

    var fetchAllTeams = function(url) {
      return $http.get(url, {params:{"getDivisionData": true}});
    };

    return {
      fetchAllTeams: fetchAllTeams
    };

  });
