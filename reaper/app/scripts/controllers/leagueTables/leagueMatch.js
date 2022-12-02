'use strict';

/**
 * @ngdoc function
 * @name NBAApp.controller:LeagueMatchCtrl
 * @description
 * # LeagueMatchCtrl
 * Controller of the NBAApp
 */
angular.module('NBAApp')
  .controller('LeagueMatchCtrl', function ($scope, $location, $routeParams, dataService, leagueMatchesService, teamsService, playerService,
                                            matchesService, matchUtilityService) {

    $scope.loadingData = true;

    setTimeout(function() {
      $scope.$apply(function() {
        $scope.loadingPromise = dataService.getLeagueMatch($routeParams.param)
            .then(function() {
              $scope.noConnection = false;
              $scope.dataSuccess = true;
              setupLeagueMatchCard($routeParams.param);
              $scope.loadingData = false;
            }, function() {
              $scope.noConnection = true;
              $scope.dataSuccess = false;
              $scope.loadingData = false;
            });
      });
    }, 50);

    function setupLeagueMatchCard(matchID) {
      $scope.leagueMatch = leagueMatchesService.getLeagueMatch(matchID);
      $scope.homeTeamName = teamsService.getTeamName($scope.leagueMatch.homeTeam);
      $scope.awayTeamName = teamsService.getTeamName($scope.leagueMatch.awayTeam);
      $scope.match1 = matchesService.getMatch($scope.leagueMatch.match1);
      $scope.match2 = matchesService.getMatch($scope.leagueMatch.match2);
      $scope.match3 = matchesService.getMatch($scope.leagueMatch.match3);
      $scope.match4 = matchesService.getMatch($scope.leagueMatch.match4);
      $scope.match5 = matchesService.getMatch($scope.leagueMatch.match5);
      $scope.match6 = matchesService.getMatch($scope.leagueMatch.match6);
      $scope.match7 = matchesService.getMatch($scope.leagueMatch.match7);
      $scope.match8 = matchesService.getMatch($scope.leagueMatch.match8);
      $scope.match9 = matchesService.getMatch($scope.leagueMatch.match9);

      $scope.homePair1Player1Text = $scope.getPlayerDisplay($scope.leagueMatch.homePair1Player1, true);
      $scope.homePair1Player2Text = $scope.getPlayerDisplay($scope.leagueMatch.homePair1Player2, true);
      $scope.homePair2Player1Text = $scope.getPlayerDisplay($scope.leagueMatch.homePair2Player1, true);
      $scope.homePair2Player2Text = $scope.getPlayerDisplay($scope.leagueMatch.homePair2Player2, true);
      $scope.homePair3Player1Text = $scope.getPlayerDisplay($scope.leagueMatch.homePair3Player1, true);
      $scope.homePair3Player2Text = $scope.getPlayerDisplay($scope.leagueMatch.homePair3Player2, true);

      $scope.awayPair1Player1Text = $scope.getPlayerDisplay($scope.leagueMatch.awayPair1Player1, true);
      $scope.awayPair1Player2Text = $scope.getPlayerDisplay($scope.leagueMatch.awayPair1Player2, true);
      $scope.awayPair2Player1Text = $scope.getPlayerDisplay($scope.leagueMatch.awayPair2Player1, true);
      $scope.awayPair2Player2Text = $scope.getPlayerDisplay($scope.leagueMatch.awayPair2Player2, true);
      $scope.awayPair3Player1Text = $scope.getPlayerDisplay($scope.leagueMatch.awayPair3Player1, true);
      $scope.awayPair3Player2Text = $scope.getPlayerDisplay($scope.leagueMatch.awayPair3Player2, true);

      $scope.cardComplete = true;
    }

    $scope.formatMatchDate = function (date) {
      var returnDate = new Date(parseInt(date));
      return returnDate.getDate() + '/' + (returnDate.getMonth() + 1) + '/' + returnDate.getFullYear();
    };

    $scope.getPlayerDisplay = function(playerID, includeGrade) {
      var grade;
      var player = playerService.getPlayer(playerID);
      if ($scope.leagueMatch && player) {
        if (includeGrade) {
          if ($scope.leagueMatch.matchType.indexOf('Mixed') !== -1) {
            grade = player.mixedGrade;
          } else {
            grade = player.doublesGrade;
          }

          return player.name + ' (' + grade + ')';
        } else {
          return player.name;
        }
      } else {
        return '';
      }
    };

    $scope.getMatchScoreDisplay = function(match) {
      if (match !== undefined) {
        if (matchUtilityService.isMatchThreeSets(match.team1Score1, match.team2Score1, match.team1Score2, match.team2Score2)) {
          return match.team1Score1 + '-' + match.team2Score1 + '  ' + match.team1Score2 + '-' + match.team2Score2 + '  ' + match.team1Score3 + '-' + match.team2Score3;
        } else {
          return match.team1Score1 + '-' + match.team2Score1 + '  ' + match.team1Score2 + '-' + match.team2Score2;
        }
      }
    };

    $scope.getWonByText = function(match) {
      if (match !== undefined) {
        var wonByText = 'Won by:';
        if (matchUtilityService.getMatchResult(match.team1Score1, match.team2Score1, match.team1Score2, match.team2Score2,
            match.team1Score3, match.team2Score3)) {
          return wonByText + teamsService.getTeamAbbreviation($scope.leagueMatch.homeTeam);
        } else {
          return wonByText + teamsService.getTeamAbbreviation($scope.leagueMatch.awayTeam);
        }
      } else {
        return '';
      }
    };

    $scope.matchConceded = function(match) {
      if (match !== undefined) {
        return match.matchPlayed !== 'true';
      } else {
        return false;
      }
    };

  });
