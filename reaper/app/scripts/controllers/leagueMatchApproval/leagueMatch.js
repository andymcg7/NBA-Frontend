'use strict';

/**
 * @ngdoc function
 * @name NBAApp.controller:LeagueMatchCtrl
 * @description
 * # LeagueMatchCtrl
 * Controller of the NBAApp
 */
angular.module('NBAApp')
  .controller('LeagueMatchCtrl', function ($scope, $location, $routeParams, $mdDialog, dataService, leagueMatchesService, teamsService,
                                           playerService, matchesService, matchUtilityService, approveMatchService, calculatePlayerAverageService) {

    $scope.loadingData = true;
    $scope.noMatchNumber = false;
    $scope.authenticationConfirmed = false;

    $scope.postingData = false;
    $scope.postingMessage = '';
    $scope.disputeSuccessful = false;
    $scope.verifySuccessful = false;

    $scope.matchApproved = 'no';

    setTimeout(function() {
      $scope.$apply(function() {

        if (!$routeParams.hasOwnProperty('param')) {
          $scope.noMatchNumber = true;
          $scope.loadingData = false;
          return;
        }

        $scope.loadingPromise = dataService.getLeagueMatch($routeParams.param)
          .then(function () {
            setupLeagueMatchCard($routeParams.param);

            if ($routeParams.hasOwnProperty('authCode')) {
              if ($routeParams.authCode === $scope.leagueMatch.creationTime) {
                $scope.authenticationConfirmed = true;
                $scope.noConnection = false;
                $scope.dataSuccess = true;
                $scope.loadingData = false;
              } else {
                $scope.loadingPromise = dataService.authenticate($scope.leagueMatch.id, $routeParams.authCode).then(function(value) {
                  $scope.authenticationConfirmed = value;
                  $scope.noConnection = false;
                  $scope.dataSuccess = true;
                  $scope.loadingData = false;
                });
              }
            } else {
              $scope.noConnection = false;
              $scope.dataSuccess = true;
              $scope.loadingData = false;
            }
          }, function () {
            $scope.noConnection = true;
            $scope.dataSuccess = false;
            $scope.loadingData = false;
          });
      }
      );
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

      //var paramsObject = $location.search();
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

    $scope.approveMatch = function() {
      approveMatchService.approveMatch($scope.leagueMatch);

      $scope.loadingData = true;
      $scope.postingData = true;
      $scope.postingMessage = 'Verifying League Match.';

      $scope.loadingPromise = dataService.approveLeagueMatch($scope.leagueMatch)
        .then(function() {
          // the match is now approved, and we've read the player and match details, now we need to calculate the averages
          // of the players involved in the match
          $scope.postingMessage = 'Calculating Player Averages';

          var playerArray = [playerService.getPlayer($scope.leagueMatch.homePair1Player1),
            playerService.getPlayer($scope.leagueMatch.homePair1Player2),
            playerService.getPlayer($scope.leagueMatch.homePair2Player1),
            playerService.getPlayer($scope.leagueMatch.homePair2Player2),
            playerService.getPlayer($scope.leagueMatch.homePair3Player1),
            playerService.getPlayer($scope.leagueMatch.homePair3Player2),
            playerService.getPlayer($scope.leagueMatch.awayPair1Player1),
            playerService.getPlayer($scope.leagueMatch.awayPair1Player2),
            playerService.getPlayer($scope.leagueMatch.awayPair2Player1),
            playerService.getPlayer($scope.leagueMatch.awayPair2Player2),
            playerService.getPlayer($scope.leagueMatch.awayPair3Player1),
            playerService.getPlayer($scope.leagueMatch.awayPair3Player2)];

          calculatePlayerAverageService.calculatePlayersAverages(playerArray);

          $scope.postingMessage = 'Updating players';

          $scope.loadingPromise = dataService.updatePlayers(playerArray)
            .then(function() {
              $scope.loadingData = false;
              $scope.verifySuccessful = true;
            }, function () {
              $scope.loadingData = false;
              $scope.verifySuccessful = false;
              $scope.noConnection = true;
            });
        }, function() {
          $scope.loadingData = false;
          $scope.verifySuccessful = false;
          $scope.noConnection = true;
        });
    };

    $scope.disputeMatch = function() {
      var disputeReasonsDialog = $mdDialog.prompt()
        .title('Dispute Match')
        .textContent('Please type in your reasons for disputing the match')
        .placeholder('reasons')
        .ariaLabel('Dispute match reasons')
        .ok('OK')
        .cancel('Cancel');

      $mdDialog.show(disputeReasonsDialog).then(function(reasons) {
        var emailDialog = $mdDialog.prompt()
          .title('Email Address')
          .textContent('Please type in your email address so we can contact you about this match.')
          .placeholder('email')
          .ariaLabel('Email')
          .ok('OK')
          .cancel('Cancel');

          $mdDialog.show(emailDialog).then(function(email) {

            var matchDateObject = new Date(parseInt($scope.leagueMatch.matchDate));
            var matchDate = matchDateObject.getDate() + '/' + (matchDateObject.getMonth() + 1) + '/' + matchDateObject.getFullYear();
            var subjectText = 'Match ' + $scope.leagueMatch.id + ': ' + teamsService.getTeamName($scope.leagueMatch.homeTeam) + ' vs ' + teamsService.getTeamName($scope.leagueMatch.awayTeam) + ' ' + matchDate;

            $scope.loadingData = true;
            $scope.postingData = true;
            $scope.postingMessage = 'Disputing League Match.';

            $scope.loadingPromise = dataService.disputeLeagueMatch(subjectText, email, reasons, $scope.leagueMatch.id)
              .then(function() {
                $scope.loadingData = false;
                $scope.disputeSuccessful = true;
              }, function() {
                $scope.loadingData = false;
                $scope.noConnection = true;
              });
          }, function() {
          });
      }, function() {
      });
    };
  });
