'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:matchesDataService
 * @description
 * # matchesDataService
 * Simple service to fetch league matches from the db
 */

angular.module('NBAApp')
  .service('leagueMatchesDataService', function($http) {

    var fetchAllLeagueMatches = function(url) {
      return $http.get(url, {params:{"getLeagueMatches": true}});
    };

    var fetchLeagueMatch = function(url, match) {
      return $http.get(url, {params:{"getLeagueMatch": true, "match": match}});
    };

    return {
      fetchAllLeagueMatches: fetchAllLeagueMatches,
      fetchLeagueMatch: fetchLeagueMatch
    };

  });
