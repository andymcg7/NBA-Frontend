'use strict';

/**
 * @ngdoc function
 * @name NBAApp.controller:LeagueTablesCtrl
 * @description
 * # LeagueTablesCtrl
 * Controller of the NBAApp
 */
angular.module('NBAApp')
  .controller('LeagueTablesCtrl', function ($scope, $location, $routeParams, dataService, leagueTablesService,
                                            teamsService) {

    $scope.loadingData = true;
    $scope.divisionList = [];
    $scope.matchesForTeam = [];
    $scope.selectedDivision = '';

    var comboInitialised = false;

    setTimeout(function() {
      $scope.$apply(function() {
        if (dataService.isInitialised()) {
          $scope.loadingData = false;
          $scope.noConnection = false;
          $scope.dataSuccess = true;
          setupView($routeParams.param);
        } else {
          $scope.loadingPromise = dataService.initialise()
            .then(function() {
              $scope.noConnection = false;
              $scope.dataSuccess = true;
              setupView($routeParams.param);
              $scope.loadingData = false;
            }, function() {
              $scope.noConnection = true;
              $scope.dataSuccess = false;
              $scope.loadingData = false;
            });
        }
      });
    }, 50);

    $scope.setupDivision = function() {
      if (comboInitialised) {
        sortTable();
        $scope.matchesForTeam = [];
        $location.search('division', $scope.selectedDivision.divisionName);
      }
    };

    $scope.$on('$routeUpdate', function(){
      updateFromParams();
    });

    function updateFromParams() {
      comboInitialised = true;

      var paramsObject = $location.search();
      if (paramsObject.hasOwnProperty('division')) {
        for (var i = 0 ; i < $scope.divisionList.length ; i++) {
          if ($scope.divisionList[i].divisionName === paramsObject.division) {
            $scope.selectedDivision = $scope.divisionList[i];
          }
        }
      } else {
        $scope.selectedDivision = $scope.divisionList[0];
        $location.search('division', $scope.selectedDivision.divisionName);
      }
    }

    function sortTable() {
      $scope.selectedDivision.teams.sort(function (a, b) {

        // if any team has won all of their matches they must finish top
        if (a.won === ($scope.selectedDivision.teams.length - 1) * 2) {
          return -1;
        }

        if (a.leaguePoints < b.leaguePoints) {
          return 1;
        }
        if (a.leaguePoints > b.leaguePoints) {
          return -1;
        }
        if (a.won < b.won) {
          return 1;
        }
        if (a.won < b.won) {
          return -1;
        }
        if (a.rubbersFor < b.rubbersFor) {
          return 1;
        }
        if (a.rubbersFor < b.rubbersFor) {
          return -1;
        }
        if ((a.setsFor - a.setsAgainst) < (b.setsFor - b.setsAgainst)) {
          return 1;
        }
        if ((a.setsFor - a.setsAgainst) > (b.setsFor - b.setsAgainst)) {
          return -1;
        }
        if ((a.pointsFor - a.pointsAgainst) < (b.pointsFor - b.pointsAgainst)) {
          return 1;
        }
        if ((a.pointsFor - a.pointsAgainst) > (b.pointsFor - b.pointsAgainst)) {
          return -1;
        }
        // a must be equal to b
        return 0;
      });
    }

    function setupView(type) {
      switch(type) {
        case 'md':
              $scope.divisionList = leagueTablesService.getMensDoublesDivisions();
              $scope.title = 'Mens Doubles';
              break;
        case 'ld':
              $scope.divisionList = leagueTablesService.getLadiesDoublesDivisions();
              $scope.title = 'Ladies Doubles';
              break;
        case 'mx':
              $scope.divisionList = leagueTablesService.getMixedDoublesDivisions();
              $scope.title = 'Mixed Doubles';
              break;
      }
      $scope.selectedDivision = $scope.divisionList[0];
      sortTable();
      updateFromParams();
    }

    $scope.showMatches = function(team) {
      $scope.matchesForTeam = leagueTablesService.getMatchesForTeam(team.id);
    };

    $scope.viewMatch = function(match) {
      $location.url('/leagueMatch/' + match.id);
      console.log(match);
    };

    $scope.getTeamName = teamsService.getTeamName;
  });
