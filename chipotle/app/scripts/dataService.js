'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:dataService
 * @description
 * # dataService
 * Service to hold of our relevant data
 */

angular.module('NBAApp')
  .service('dataService', function(playersDataService, clubsDataService, matchesDataService, teamsDataService, leagueMatchesDataService, $q, $resource,
                                   playerService, clubsService, matchesService, teamsService, calculateRankingsService, leagueMatchesService, divisionsService, leagueTablesService){

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
          var teamsPromise = teamsDataService.fetchAllTeams(config.teamsAPI);
          var playersPromise = playersDataService.fetchAllPlayers(config.playersAPI);
          var leagueMatchesPromise = leagueMatchesDataService.fetchAllLeagueMatches(config.leagueMatchesAPI);

          $q.all([clubsPromise, teamsPromise, playersPromise, leagueMatchesPromise]).then(function(value) {
            // Success callback where value is an array containing the success values
            clubsService.setClubs(value[0].data);
            teamsService.setTeams(value[1].data);
            playerService.setPlayers(value[2].data);
            leagueMatchesService.setLeagueMatches(value[3].data);

            calculateRankingsService.calculateOverallRankingsAndStore(value[2].data);
            divisionsService.calculateDivisions();
            leagueTablesService.calculateLeagueTables();

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


    return {
      initialise: initialise,
      isInitialised: function() { return initialised; }
    };

  });
