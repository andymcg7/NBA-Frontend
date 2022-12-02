'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:serverDateService
 * @description
 * # serverDateService
 * Simple service to fetch the current time from the server
 */

angular.module('NBAApp')
  .service('serverTimeService', function($http, $q) {

    var fetchServerTime = function(url, offline) {
      if (offline) {
        var deferred = $q.defer();
        setTimeout(function() {
          var currentDate = new Date().getTime();
          deferred.resolve(currentDate);
        }, 50);

        return deferred.promise;
      } else {
        return $http.get(url, {params: {"serverDate": true}});
      }
    };

    return {
      fetchServerTime: fetchServerTime
    };

  });
