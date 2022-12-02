'use strict';

/**
 * @ngdoc function
 * @name NBAApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the NBAApp
 */
angular.module('NBAApp')
  .controller('PlayerCtrl', function ($scope, $routeParams, $location, dataService, playerService, matchesService,
                                      matchUtilityService, separateMatchesService, clubsService, gradeService) {

    $scope.singlesGradeHistoryDisplay = [];
    $scope.doublesGradeHistoryDisplay = [];
    $scope.mixedGradeHistoryDisplay = [];
    $scope.loadingData = true;
    $scope.viewTab = 'singles';

    $scope.dataReady = false;

    var tabCtrlInitialised = false;

    function setup() {
      $scope.player = playerService.getPlayer($routeParams.param);

      // If we've already got the matches display them, otherwise we'll need to get them
      if (matchesService.hasPlayersMatches($scope.player.id)) {
        $scope.matches = matchesService.getMatchesForPlayerFromExistingData($scope.player.id);
        buildPage();
      } else {
        $scope.loadingPromise = dataService.getMatchesForPlayer($scope.player.id)
          .then(function() {
            $scope.noConnection = false;
            $scope.dataSuccess = true;
            $scope.matches = matchesService.getMatchesForPlayerFromExistingData($scope.player.id);
            buildPage();
          }, function() {
            $scope.noConnection = true;
            $scope.dataSuccess = false;
          });
      }
    }

    $scope.$on('$routeUpdate', function(){
      updateFromParams();
    });

    function updateFromParams() {
      tabCtrlInitialised = true;

      var paramsObject = $location.search();
      if (paramsObject.hasOwnProperty('view')) {
        switch(paramsObject.view) {
          case 'doubles':
            $scope.selectedTabIndex = 1;
            $scope.viewTab = 'doubles';
                break;
          case 'mixed':
            $scope.selectedTabIndex = 2;
            $scope.viewTab = 'mixed';
                break;
          default:
            $scope.selectedTabIndex = 0;
            $scope.viewTab = 'singles';
        }
      } else {
        $scope.selectedTabIndex = 0;
      }

      setTimeout(function() {
        $scope.$apply(function() {
          $scope.dataReady = true;
        });
      }, 50);


    }


    setTimeout(function() {
      $scope.$apply(function() {
        if (dataService.isInitialised()) {
          $scope.loadingData = false;
          setup();
        } else {
          $scope.loadingPromise = dataService.initialise()
            .then(function() {
              $scope.noConnection = false;
              $scope.dataSuccess = true;
              $scope.loadingData = false;
              setup();
            }, function() {
              $scope.noConnection = true;
              $scope.dataSuccess = false;
              $scope.loadingData = false;
            });
        }
      });
    }, 50);


     function buildPage() {
      separateMatchesService.separateMatches(matchesService.returnPlayerMatches());
      $scope.singlesGradeHistoryDisplay = $scope.player.singlesGradeHistory.split('|');
      $scope.doublesGradeHistoryDisplay = $scope.player.doublesGradeHistory.split('|');
      $scope.mixedGradeHistoryDisplay = $scope.player.mixedGradeHistory.split('|');

       $scope.activeInSingles = ($scope.player.singlesMatchesPlayed > 0);
       $scope.activeInDoubles = ($scope.player.doublesMatchesPlayed > 0);
       $scope.activeInMixed = ($scope.player.mixedMatchesPlayed > 0);

       $scope.getClubDisplay = clubsService.getClubDisplay;

       $scope.getGradePromotionValue = gradeService.getPromotionValue;
       $scope.getGradeDemotionValue = gradeService.getDemotionValue;

       $scope.singles = {};
       $scope.doubles = {};
       $scope.mixed = {};

       $scope.singles.matches = separateMatchesService.getSinglesMatches();

       var singlesStatus = gradeService.getPlayerStatus($scope.player.singlesGrade, $scope.player.singlesAverage, $scope.player.singlesDemotionAverage);
       if (singlesStatus === 'promotion') {
         $scope.singles.promotion = true;
         $scope.singles.demotion = false;
         $scope.singles.remain = false;
       } else if (singlesStatus === 'demotion') {
         $scope.singles.promotion = false;
         $scope.singles.demotion = true;
         $scope.singles.remain = false;
       } else {
         $scope.singles.promotion = false;
         $scope.singles.demotion = false;
         $scope.singles.remain = true;
       }

       $scope.doubles.matches = separateMatchesService.getDoublesMatches();

       var doublesStatus = gradeService.getPlayerStatus($scope.player.doublesGrade, $scope.player.doublesAverage, $scope.player.doublesDemotionAverage);
       if (doublesStatus === 'promotion') {
         $scope.doubles.promotion = true;
         $scope.doubles.demotion = false;
         $scope.doubles.remain = false;
       } else if (doublesStatus === 'demotion') {
         $scope.doubles.promotion = false;
         $scope.doubles.demotion = true;
         $scope.doubles.remain = false;
       } else {
         $scope.doubles.promotion = false;
         $scope.doubles.demotion = false;
         $scope.doubles.remain = true;
       }

       $scope.mixed.matches = separateMatchesService.getMixedMatches();

       var mixedStatus = gradeService.getPlayerStatus($scope.player.mixedGrade, $scope.player.mixedAverage, $scope.player.mixedDemotionAverage);
       if (mixedStatus === 'promotion') {
         $scope.mixed.promotion = true;
         $scope.mixed.demotion = false;
         $scope.mixed.remain = false;
       } else if (mixedStatus === 'demotion') {
         $scope.mixed.promotion = false;
         $scope.mixed.demotion = true;
         $scope.mixed.remain = false;
       } else {
         $scope.mixed.promotion = false;
         $scope.mixed.demotion = false;
         $scope.mixed.remain = true;
       }

       updateFromParams();
    }

    $scope.formatMatchDate = function (date) {
      var returnDate = new Date(parseInt(date));
      return returnDate.getDate() + '/' + (returnDate.getMonth() + 1) + '/' + returnDate.getFullYear();
    };

    $scope.getMatchResult = matchUtilityService.getShortMatchResult;
    $scope.getOpponentName = matchUtilityService.getOpponentName;
    $scope.getPartnerName = matchUtilityService.getPartnerName;
    $scope.getPartnerGrade = matchUtilityService.getPartnerGrade;
    $scope.getPartnerID = matchUtilityService.getPartnerID;
    $scope.getMatchScore = matchUtilityService.getMatchScore;
    $scope.getOpponentGrade = matchUtilityService.getOpponentGrade;
    $scope.getOpponentID = matchUtilityService.getOpponentID;
    $scope.getMatchPoints = function(match) {
      if (matchUtilityService.getShortMatchResult(match, $scope.player.id) === 'Won') {
        return gradeService.getGradeValue(gradeService.getOpponentGrade(match, $scope.player));
      } else {
        return 0;
      }
    };

    $scope.hasValidGradeHistory = function (discipline) {
      if (discipline === 'Singles') {
        return $scope.singlesGradeHistoryDisplay.length > 0 && $scope.singlesGradeHistoryDisplay[0] !== '';
      } else if (discipline === 'Doubles') {
        return $scope.doublesGradeHistoryDisplay.length > 0 && $scope.doublesGradeHistoryDisplay[0] !== '';
      } else {
        return $scope.mixedGradeHistoryDisplay.length > 0 && $scope.mixedGradeHistoryDisplay[0] !== '';
      }
    };

    $scope.singlesSort = function(keyname){
      $scope.singlesSortKey = keyname;   //set the sortKey to the param passed
      $scope.singlesReverse = !$scope.singlesReverse; //if true make it false and vice versa
    };

    $scope.doublesSort = function(keyname){
      $scope.doublesSortKey = keyname;   //set the sortKey to the param passed
      $scope.doublesReverse = !$scope.doublesReverse; //if true make it false and vice versa
    };

    $scope.mixedSort = function(keyname){
      $scope.mixedSortKey = keyname;   //set the sortKey to the param passed
      $scope.mixedReverse = !$scope.mixedReverse; //if true make it false and vice versa
    };

    $scope.singlesOrderByFunction = function(match) {
      switch($scope.singlesSortKey) {
        case 'match':
              return match.title;
        case 'score':
              return $scope.getMatchResult(match, $scope.player.id);
        case 'result':
              return $scope.getMatchResult(match, $scope.player.id);
        case 'opponent':
              return $scope.getOpponentName(match, $scope.player);
        case 'points':
              return $scope.getMatchPoints(match);
        case 'date':
              return Number(match[$scope.singlesSortKey]);
        case 'opponentGrade':
          return $scope.getOpponentGrade(match, $scope.player);
      }
    };

    $scope.doublesOrderByFunction = function(match) {
      switch($scope.doublesSortKey) {
        case 'match':
          return match.title;
        case 'score':
          return $scope.getMatchResult(match, $scope.player.id);
        case 'result':
          return $scope.getMatchResult(match, $scope.player.id);
        case 'partner':
          return $scope.getPartnerName(match, $scope.player);
        case 'opponent':
          return $scope.getOpponentName(match, $scope.player);
        case 'points':
          return $scope.getMatchPoints(match);
        case 'date':
          return Number(match[$scope.doublesSortKey]);
        case 'opponentGrade':
          return $scope.getOpponentGrade(match, $scope.player);
        case 'partnerGrade':
          return $scope.getPartnerGrade(match, $scope.player);
      }
    };

    $scope.mixedOrderByFunction = function(match) {
      switch($scope.mixedSortKey) {
        case 'match':
          return match.title;
        case 'score':
          return $scope.getMatchResult(match, $scope.player.id);
        case 'result':
          return $scope.getMatchResult(match, $scope.player.id);
        case 'partner':
          return $scope.getPartnerName(match, $scope.player);
        case 'opponent':
          return $scope.getOpponentName(match, $scope.player);
        case 'points':
          return $scope.getMatchPoints(match);
        case 'date':
          return Number(match[$scope.mixedSortKey]);
        case 'opponentGrade':
          return $scope.getOpponentGrade(match, $scope.player);
        case 'partnerGrade':
          return $scope.getPartnerGrade(match, $scope.player);
      }
    };

    $scope.onTabSelected = function() {
      if (tabCtrlInitialised) {
        switch ($scope.selectedTabIndex) {
          case 0:
            $location.search('view', 'singles');
            break;
          case 1:
            $location.search('view', 'doubles');
            break;
          case 2:
            $location.search('view', 'mixed');
            break;
        }
      }
    };

    $scope.singlesSortKey = 'name';
    $scope.singlesReverse = false;

    $scope.doublesSortKey = 'name';
    $scope.doublesReverse = false;

    $scope.mixedSortKey = 'name';
    $scope.mixedReverse = false;

  });
