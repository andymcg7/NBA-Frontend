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
                                   leagueTablesService, playerService, clubsService, disputeMatchDataService, authenticateLeagueMatchDataService,
                                    serverTimeService, approveMatchDataService, updatePlayersDataService) {

    var initialised = false;
    var configFile = 'configuration.txt';
    //var configFile = 'offlineConfig.txt';
    var offline = false;
    var config = {};

    var serverTime = new Date().getTime();

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
                  teamsDataService.fetchAllTeams(config.teamsAPI)],
                  serverTimeService.fetchServerTime(config.leagueMatchesAPI, offline)).then(function (value) {

            clubsService.setClubs(value[1].data);
            teamsService.setTeams(value[2].data);
            serverTime = value[3];

            if (value[0].data.length === 0) {
              deferred.reject("Fail");
            } else {
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
          }}, function (reason) {
            deferred.reject("Fail - unable to get league match");
          });
        } else {
          deferred.reject("Fail - unable to read config");
        }
      });
      return deferred.promise;
    }

    function disputeLeagueMatch(subject, email, text, matchID) {
      var deferred = $q.defer();

      var resource = $resource(configFile);
      resource.get().$promise.then(function(value) {
        if (value.$resolved) {
          config = value.config;

          $q.all([disputeMatchDataService.disputeMatch(config.leagueMatchesAPI, subject, email, text, matchID)]).then(function () {
            deferred.resolve("Success");
          }, function() {
            // Error callback where reason is the value of the first rejected promise
            deferred.reject("Fail");
          });
        } else {
          deferred.reject("Fail");
        }
      });
      return deferred.promise;
    }

    function approveLeagueMatch(leagueMatch) {
      var deferred = $q.defer();

      var resource = $resource(configFile);
      resource.get().$promise.then(function(value) {
        if (value.$resolved) {
          config = value.config;
          var approveLeagueMatchPromise = approveMatchDataService.approveMatch(config.leagueMatchesAPI, leagueMatch);

          $q.all([approveLeagueMatchPromise]).then(function(value) {

            // Now the match is approved we need to recalculate the player averages involved in this match
            // First we need to get all of the players and matches in the db
            var playersPromise = playersDataService.fetchAllPlayers(config.playersAPI);
            var matchesPromise = matchesDataService.fetchAllMatches(config.matchesAPI);

            $q.all([playersPromise, matchesPromise]).then(function(value) {
              playerService.setPlayers(value[0].data);
              matchesService.setMatches(value[1].data);
              deferred.resolve("Success");
            }, function() {
              deferred.resolve("Fail");
            });
          }, function() {
            // Error callback where reason is the value of the first rejected promise
            deferred.reject("Fail");
          });
        } else {
          deferred.reject("Fail");
        }
      });
      return deferred.promise;
    }

    function updatePlayers(players) {
      var deferred = $q.defer();

      var resource = $resource(configFile);
      resource.get().$promise.then(function(value) {
        if (value.$resolved) {
          config = value.config;
          var updatePlayersPromise = updatePlayersDataService.updatePlayers(config.playersAPI, players);

          $q.all([updatePlayersPromise]).then(function(value) {
            // Players successfully updated, nothing more needs to be done
            deferred.resolve("Success");
          }, function() {
            // Error callback where reason is the value of the first rejected promise
            deferred.reject("Fail");
          });
        } else {
          deferred.reject("Fail");
        }
      });
      return deferred.promise;
    }

    function authenticate(matchID, authCode) {
      var deferred = $q.defer();

      var resource = $resource(configFile);
      resource.get().$promise.then(function(value) {
        if (value.$resolved) {
          config = value.config;

          $q.all([authenticateLeagueMatchDataService.authenticateLeagueMatch(config.leagueMatchesAPI, matchID, authCode)]).then(function (value) {
            deferred.resolve(value);
          }, function() {
            // Error callback where reason is the value of the first rejected promise
            deferred.reject("Fail");
          });
        } else {
          deferred.reject("Fail");
        }
      });
      return deferred.promise;
    }


    return {
      initialise: initialise,
      isInitialised: function() { return initialised; },
      getLeagueMatch: getLeagueMatch,
      disputeLeagueMatch: disputeLeagueMatch,
      approveLeagueMatch: approveLeagueMatch,
      authenticate: authenticate,
      updatePlayers: updatePlayers
    };

  });
