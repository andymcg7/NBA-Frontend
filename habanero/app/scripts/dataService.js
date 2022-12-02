'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:dataService
 * @description
 * # dataService
 * Service to hold of our relevant data
 */

angular.module('NBAApp')
  .service('dataService', function(playersDataService, clubsDataService, matchesDataService, $q, $resource,
                                   playerService, clubsService, matchesService, calculateRankingsService){

    var initialised = false;
    var configFile = 'configuration.txt';
    //var configFile = 'offlineConfig.txt';
    var config = {};

    function initialise() {

      var deferred = $q.defer();

      var resource = $resource(configFile);
      resource.get().$promise.then(function(value) {
        if (value.$resolved) {
          config = value.config;
          var clubsPromise = clubsDataService.fetchAllClubs(config.clubsAPI);
          var playersPromise = playersDataService.fetchAllPlayers(config.playersAPI);

          $q.all([clubsPromise, playersPromise]).then(function(value) {
            // Success callback where value is an array containing the success values
            clubsService.setClubs(value[0].data);
            playerService.setPlayers(value[1].data);
            calculateRankingsService.calculateOverallRankingsAndStore(value[1].data);

            initialised = true;
            deferred.resolve('Success');
          }, function() {
            // Error callback where reason is the value of the first rejected promise
            deferred.reject('Fail');
          });
        } else {
          deferred.reject('Fail');
        }
      });
      return deferred.promise;
    }

    function getMatchesForPlayer(playerID) {
      var deferred = $q.defer();

      var matchesPromise = matchesDataService.fetchMatchesForPlayer(config.matchesAPI, playerID);
      $q.resolve(matchesPromise).then(function(value) {
        matchesService.setMatchesForPlayer(value.data, playerID);
        deferred.resolve('Success');
      }, function() {
        // Error callback where reason is the value of the first rejected promise
        deferred.reject('Fail');
      });

      return deferred.promise;
    }


    return {
      initialise: initialise,
      isInitialised: function() { return initialised; },
      getMatchesForPlayer: getMatchesForPlayer
    };

  });
