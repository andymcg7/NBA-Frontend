'use strict';

/**
 * @ngdoc function
 * @name NBAApp.controller:RankingsCtrl
 * @description
 * # RankingsCtrl
 * Controller of the NBAApp
 */
angular.module('NBAApp')
  .controller('RankingsCtrl', function ($scope, $filter, $location, $routeParams, $q, dataService, playerService, clubsService, calculateRankingsService) {

    $scope.search = '';
    $scope.selected = [];
    $scope.loadingData = true;
    $scope.title = '';
    $scope.reverse = false;
    $scope.grades = ['All', 'A', 'B', 'C', 'D', 'E', 'UG'];

    var discipline;

    $scope.sort = function(keyname){
      $scope.sortKey = keyname;   //set the sortKey to the param passed
      $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    };

    $scope.$on('$routeUpdate', function(){
      updateFilterFromParams();
    });

    function updateFilterFromParams() {
      var paramsObject = $location.search();
      if (paramsObject.hasOwnProperty('club')) {
        $scope.selectedClub = $scope.clubs.find(function findClub(club) {
          return club.id === paramsObject.club;
        });
      } else {
        $scope.selectedClub = $scope.clubs[0];
      }

      if (paramsObject.hasOwnProperty('grade')) {
        if (paramsObject.grade === 'All') {
          $scope.selectedGrade = $scope.grades[0];
        } else {
          $scope.selectedGrade = paramsObject.grade;
        }
      } else {
        $scope.selectedGrade = $scope.grades[0];
      }
    }

    var setupView = function(dis) {
      discipline = dis;
      $scope.clubs = clubsService.getSortedClubDisplayList();
      updateFilterFromParams();

      switch(discipline) {
        case 'ms':
          $scope.players = calculateRankingsService.returnMSPlayers();
          $scope.title = 'Mens Singles';
          $scope.rankingField = 'singlesRanking';
          $scope.averageField = 'singlesAverage';
          $scope.gradeField = 'singlesGrade';
          $scope.matchesPlayedField = 'singlesMatchesPlayed';
          $scope.viewTab = 'singles';
          break;
        case 'ls':
          $scope.players = calculateRankingsService.returnLSPlayers();
          $scope.title = 'Ladies Singles';
          $scope.rankingField = 'singlesRanking';
          $scope.averageField = 'singlesAverage';
          $scope.gradeField = 'singlesGrade';
          $scope.matchesPlayedField = 'singlesMatchesPlayed';
          $scope.viewTab = 'singles';
          break;
        case 'md':
          $scope.players = calculateRankingsService.returnMDPlayers();
          $scope.title = 'Mens Doubles';
          $scope.rankingField = 'doublesRanking';
          $scope.averageField = 'doublesAverage';
          $scope.gradeField = 'doublesGrade';
          $scope.matchesPlayedField = 'doublesMatchesPlayed';
          $scope.viewTab = 'doubles';
          break;
        case 'ld':
          $scope.players = calculateRankingsService.returnLDPlayers();
          $scope.title = 'Ladies Doubles';
          $scope.rankingField = 'doublesRanking';
          $scope.averageField = 'doublesAverage';
          $scope.gradeField = 'doublesGrade';
          $scope.matchesPlayedField = 'doublesMatchesPlayed';
          $scope.viewTab = 'doubles';
          break;
        case 'mxd':
          $scope.players = calculateRankingsService.returnMXDPlayers();
          $scope.title = 'Mens Mixed Doubles';
          $scope.rankingField = 'mixedRanking';
          $scope.averageField = 'mixedAverage';
          $scope.gradeField = 'mixedGrade';
          $scope.matchesPlayedField = 'mixedMatchesPlayed';
          $scope.viewTab = 'mixed';
          break;
        case 'lxd':
          $scope.players = calculateRankingsService.returnLXDPlayers();
          $scope.title = 'Ladies Mixed Doubles';
          $scope.rankingField = 'mixedRanking';
          $scope.averageField = 'mixedAverage';
          $scope.gradeField = 'mixedGrade';
          $scope.matchesPlayedField = 'mixedMatchesPlayed';
          $scope.viewTab = 'mixed';
          break;
      }
      $scope.sort('average');
    };

    setTimeout(function() {
      $scope.$apply(function() {
        if (dataService.isInitialised()) {
          $scope.loadingData = false;
          setupView($routeParams.param);
        } else {
          $scope.loadingPromise = dataService.initialise()
            .then(function () {
              $scope.noConnection = false;
              $scope.dataSuccess = true;
              $scope.loadingData = false;
              setupView($routeParams.param);
            }, function () {
              $scope.noConnection = true;
              $scope.dataSuccess = false;
              $scope.loadingData = false;
            });
        }
      });
    }, 50);

    $scope.orderByFunction = function(player) {
      var key = $scope.sortKey;

      if ($scope.sortKey === 'rank') {
        key = $scope.rankingField;
      } else if ($scope.sortKey === 'average') {
        key = $scope.averageField;
      } else if ($scope.sortKey === 'matchesPlayed') {
        key = $scope.matchesPlayedField;
      } else if ($scope.sortKey === 'grade') {
        key = $scope.gradeField;
      }

      if (!isNaN(player[key])) {
        return Number(player[key]);
      } else {
        var string = player[key];
        if (string === undefined) {
          return undefined;
        } else if (string.indexOf('=') !== -1) {
          return parseFloat(string);
        } else {
          return string;
        }
      }
    };

    $scope.gradeFilterClose = function() {
      $location.search('grade', $scope.selectedGrade);
    };

    $scope.clubFilterClose = function() {
      $location.search('club', $scope.selectedClub.id);
    };

    $scope.filterFn = function(player) {
      if ($scope.selectedClub.id === undefined || $scope.selectedClub.id === 0 || $scope.selectedClub.id === 'all') {
        return playerMatchesSearchFilter(player) && playerMatchesGradeFilter(player);
      } else {
        if (player.primaryClub === $scope.selectedClub.id || player.secondaryClub === $scope.selectedClub.id) {
          return playerMatchesSearchFilter(player) && playerMatchesGradeFilter(player);
        } else {
          return false;
        }
      }
      return false;
    };

    function playerMatchesGradeFilter(player) {
      if ($scope.selectedGrade === 'All') {
        return true;
      } else {
        return player[$scope.gradeField].indexOf($scope.selectedGrade) !== -1;
      }
    }

    function playerMatchesSearchFilter(player) {
      if (player.name.toLowerCase().indexOf($scope.search.toLowerCase()) !== -1) {
        return true;
      }
      return false;
    }

    $scope.getClubDisplay = clubsService.getClubDisplay;

    $scope.getRanking = function(player) {
      switch(discipline) {
        case 'ms':
        case 'ls':
              return player.singlesRanking;
        case 'md':
        case 'ld':
              return player.doublesRanking;
        case 'mxd':
        case 'lxd':
              return player.mixedRanking;
      }
    };

    $scope.getGrade = function(player) {
      switch(discipline) {
        case 'ms':
        case 'ls':
          return player.singlesGrade;
        case 'md':
        case 'ld':
          return player.doublesGrade;
        case 'mxd':
        case 'lxd':
          return player.mixedGrade;
      }
    };

    $scope.getMatchesPlayed = function(player) {
      switch(discipline) {
        case 'ms':
        case 'ls':
          return player.singlesMatchesPlayed;
        case 'md':
        case 'ld':
          return player.doublesMatchesPlayed;
        case 'mxd':
        case 'lxd':
          return player.mixedMatchesPlayed;
      }
    };

    $scope.getAverage = function(player) {
      switch(discipline) {
        case 'ms':
        case 'ls':
          return Number(player.singlesAverage);
        case 'md':
        case 'ld':
          return Number(player.doublesAverage);
        case 'mxd':
        case 'lxd':
          return Number(player.mixedAverage);
      }
    };
  });
