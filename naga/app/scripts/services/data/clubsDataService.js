'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:clubsDataService
 * @description
 * # clubsDataService
 * Simple service to fetch clubs from the db
 */

angular.module('NBAApp')
  .service('clubsDataService', function($http) {

    var fetchAllClubs = function(url) {
      return $http.get(url, {params:{"getClubs": true}});
    };

    return {
      fetchAllClubs: fetchAllClubs
    };

  });
