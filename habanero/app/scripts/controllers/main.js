'use strict';

/**
 * @ngdoc function
 * @name NBAApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the NBAApp
 */
angular.module('NBAApp')
  .controller('MainCtrl', function ($scope, $filter, $location, $q, dataService, playerService, clubsService) {

    $scope.search = '';
    $scope.selected = [];
    $scope.loadingData = true;
    var paramsObject = $location.search();
    var clubToShow = 0;
    if (paramsObject.hasOwnProperty('club')) {
      clubToShow = paramsObject.club;
    }

    if (dataService.isInitialised()) {
      $scope.loadingData = false;
      $scope.players = playerService.getAllPlayers();
    } else {
      $scope.loadingPromise = dataService.initialise()
        .then(function() {
          $scope.noConnection = false;
          $scope.dataSuccess = true;
          $scope.players = playerService.getAllPlayers();
          $scope.loadingData = false;
        }, function() {
          $scope.noConnection = true;
          $scope.dataSuccess = false;
          $scope.loadingData = false;
          $scope.players = [];
          $scope.filteredPlayers = [];
        });
    }

    $scope.sort = function(keyname){
      $scope.sortKey = keyname;   //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };

    $scope.filterFn = function(player) {
      if (clubToShow === undefined || clubToShow === 0) {
        return playerMatchesFilter(player);
      } else {
        if (player.primaryClub === clubToShow || player.secondaryClub === clubToShow) {
          return playerMatchesFilter(player);
        } else {
          return false;
        }
      }
      return false;
    };

    function playerMatchesFilter(player) {
      if (player.name.toLowerCase().indexOf($scope.search.toLowerCase()) !== -1) {
        return true;
      }
      return false;
    }

    $scope.orderByFunction = function(player) {
      if (!isNaN(player[$scope.sortKey])) {
        return Number(player[$scope.sortKey]);
      } else {
        return player[$scope.sortKey];
      }
    };

    $scope.getClubDisplay = clubsService.getClubDisplay;
    $scope.sortKey = 'name';
    $scope.reverse = false;
  });
