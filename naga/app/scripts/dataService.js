'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:dataService
 * @description
 * # dataService
 * Service to hold of our relevant data
 */

angular.module('NBAApp')
  .service('dataService', function(playersDataService, clubsDataService, teamsDataService, leagueMatchesDataService,
                                   matchesDataService, matchesService, $q, $resource, teamsService, leagueMatchesService,
                                   leagueTablesService, playerService, clubsService){

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
          var leagueMatchesPromise = leagueMatchesDataService.fetchAllLeagueMatches(config.leagueMatchesAPI);

          $q.all([clubsPromise, teamsPromise, leagueMatchesPromise]).then(function(value) {
            // Success callback where value is an array containing the success values
            clubsService.setClubs(value[0].data);
            teamsService.setTeams(value[1].data);
            leagueMatchesService.setLeagueMatches(value[2].data);
            leagueTablesService.calculateLeagueTables();

            initialised = true;
            deferred.resolve("Success");
          }, function(reason) {
            // Error callback where reason is the value of the first rejected promise
            deferred.reject("Fail");
          });
        } else {
          deferred.reject("Fail");
        }
      });
      return deferred.promise;
    };

    function getLeagueMatch(leagueMatchID) {
      var deferred = $q.defer();

      var resource = $resource(configFile);
      resource.get().$promise.then(function(value) {
        if (value.$resolved) {
          config = value.config;

          $q.all([leagueMatchesDataService.fetchLeagueMatch(config.leagueMatchesAPI, leagueMatchID),
                  clubsDataService.fetchAllClubs(config.clubsAPI),
                  teamsDataService.fetchAllTeams(config.teamsAPI)]).then(function (value) {

            clubsService.setClubs(value[1].data);
            teamsService.setTeams(value[2].data);

            leagueMatchesService.addLeagueMatches(value[0].data);
            var leagueMatch = leagueMatchesService.getLeagueMatch(leagueMatchID);

            // build array of player IDs to fetch
            var playersArray = [];
            playersArray.push(leagueMatch.homePair1Player1);
            playersArray.push(leagueMatch.homePair1Player2);
            playersArray.push(leagueMatch.homePair2Player1);
            playersArray.push(leagueMatch.homePair2Player2);
            playersArray.push(leagueMatch.homePair3Player1);
            playersArray.push(leagueMatch.homePair3Player2);
            playersArray.push(leagueMatch.awayPair1Player1);
            playersArray.push(leagueMatch.awayPair1Player2);
            playersArray.push(leagueMatch.awayPair2Player1);
            playersArray.push(leagueMatch.awayPair2Player2);
            playersArray.push(leagueMatch.awayPair3Player1);
            playersArray.push(leagueMatch.awayPair3Player2);

            $q.all([playersDataService.fetchPlayers(config.playersAPI, playersArray),
              matchesDataService.fetchMatch(config.matchesAPI, leagueMatch.match1),
              matchesDataService.fetchMatch(config.matchesAPI, leagueMatch.match2),
              matchesDataService.fetchMatch(config.matchesAPI, leagueMatch.match3),
              matchesDataService.fetchMatch(config.matchesAPI, leagueMatch.match4),
              matchesDataService.fetchMatch(config.matchesAPI, leagueMatch.match5),
              matchesDataService.fetchMatch(config.matchesAPI, leagueMatch.match6),
              matchesDataService.fetchMatch(config.matchesAPI, leagueMatch.match7),
              matchesDataService.fetchMatch(config.matchesAPI, leagueMatch.match8),
              matchesDataService.fetchMatch(config.matchesAPI, leagueMatch.match9)]).then(function (value) {

              playerService.addPlayers(value[0].data);
              matchesService.addMatches([value[1].data, value[2].data, value[3].data, value[4].data, value[5].data,
                value[6].data, value[7].data, value[8].data, value[9].data,]);

              deferred.resolve("Success");
            }, function (reason) {
              // Error callback where reason is the value of the first rejected promise
              deferred.reject("Fail");
            });
          }, function (reason) {
            deferred.reject("Fail - unable to get league match");
          });
        } else {
          deferred.reject("Fail - unable to read config");
        }
      });
      return deferred.promise;
    }


    return {
      initialise: initialise,
      isInitialised: function() { return initialised; },
      getLeagueMatch: getLeagueMatch
    };

  });
