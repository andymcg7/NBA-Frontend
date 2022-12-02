'use strict';

/**
 * @ngdoc function
 * @name serranoApp.controller:LeagueMatchCtrl
 * @description
 * # LeagueMatchCtrl
 * Controller of the NBAApp
 */
angular.module('NBAApp')
  .controller('LeagueMatchEntryCtrl', function ($scope, $location, $routeParams, $mdDialog, $mdToast, dataService, leagueMatchesService, validateLeagueMatchService,
                                                divisionsService, clubsService, teamsService, playerService, matchesService, matchUtilityService, $mdBottomSheet,
                                                gradeService) {

    $scope.loadingData = true;

    $scope.disciplineList = ['Mixed Doubles', 'Mens Doubles', 'Ladies Doubles'];
    $scope.divisionList = [];

    function reset() {
      $scope.leagueMatch = {};
      $scope.leagueMatch.match1 = {};
      $scope.leagueMatch.match2 = {};
      $scope.leagueMatch.match3 = {};
      $scope.leagueMatch.match4 = {};
      $scope.leagueMatch.match5 = {};
      $scope.leagueMatch.match6 = {};
      $scope.leagueMatch.match7 = {};
      $scope.leagueMatch.match8 = {};
      $scope.leagueMatch.match9 = {};
      $scope.leagueMatch.match1.matchPlayed = true;
      $scope.leagueMatch.match2.matchPlayed = true;
      $scope.leagueMatch.match3.matchPlayed = true;
      $scope.leagueMatch.match4.matchPlayed = true;
      $scope.leagueMatch.match5.matchPlayed = true;
      $scope.leagueMatch.match6.matchPlayed = true;
      $scope.leagueMatch.match7.matchPlayed = true;
      $scope.leagueMatch.match8.matchPlayed = true;
      $scope.leagueMatch.match9.matchPlayed = true;

      $scope.leagueMatch.division = '';

      $scope.leagueMatch.email = '';

      $scope.homeTeamAbbreviation = '';
      $scope.awayTeamAbbreviation = '';

      $scope.teamList = [];
      $scope.homeTeamMasterListPlayers1 = [];
      $scope.homeTeamMasterListPlayers2 = [];
      $scope.awayTeamMasterListPlayers1 = [];
      $scope.awayTeamMasterListPlayers2 = [];
      $scope.homeTeamAvailablePlayers1 = [];
      $scope.homeTeamAvailablePlayers2 = [];
      $scope.awayTeamAvailablePlayers1 = [];
      $scope.awayTeamAvailablePlayers2 = [];

      $scope.matchPlayers = {};

      $scope.errorStrings = [];
    }

    reset();

    setTimeout(function() {
      $scope.$apply(function() {

        if (dataService.isInitialised()) {
          $scope.loadingData = false;
          $scope.noConnection = false;
          $scope.dataSuccess = true;
        } else {
          $scope.loadingPromise = dataService.initialise()
            .then(function() {
              $scope.noConnection = false;
              $scope.dataSuccess = true;
              $scope.loadingData = false;
            }, function() {
              $scope.noConnection = true;
              $scope.dataSuccess = false;
              $scope.loadingData = false;
            });
        }
      });
    }, 50);

    $scope.getDisciplineText = function() {
      if ($scope.leagueMatch.matchDiscipline !== undefined) {
        return $scope.leagueMatch.matchDiscipline;
      } else {
        return 'Choose match type';
      }
    };

    $scope.getSelectedDivisionText = function() {
      if ($scope.leagueMatch.division !== undefined && $scope.leagueMatch.division !== '') {
        return $scope.leagueMatch.division.divisionName;
      } else {
        return 'Choose division';
      }
    };

    $scope.disciplineChosen = function() {
      switch($scope.leagueMatch.matchDiscipline) {
        case 'Mens Doubles':
          $scope.divisionList = divisionsService.getMensDoublesDivisions();
          $scope.title = 'Mens Doubles';
          break;
        case 'Ladies Doubles':
          $scope.divisionList = divisionsService.getLadiesDoublesDivisions();
          $scope.title = 'Ladies Doubles';
          break;
        case 'Mixed Doubles':
          $scope.divisionList = divisionsService.getMixedDoublesDivisions();
          $scope.title = 'Mixed Doubles';
          break;
      }
      $scope.teamList = undefined;
      $scope.homeTeamList = undefined;
      $scope.awayTeamList = undefined;
      $scope.leagueMatch.division = undefined;
      $scope.leagueMatch.homeTeam = undefined;
      $scope.leagueMatch.awayTeam = undefined;
      $scope.leagueMatch.venue = '';
      $scope.homeTeamMasterListPlayers1 = [];
      $scope.homeTeamMasterListPlayers2 = [];
      $scope.awayTeamMasterListPlayers1 = [];
      $scope.awayTeamMasterListPlayers2 = [];
      $scope.homeTeamAvailablePlayers1 = [];
      $scope.homeTeamAvailablePlayers2 = [];
      $scope.awayTeamAvailablePlayers1 = [];
      $scope.awayTeamAvailablePlayers2 = [];
    };

    $scope.divisionChosen = function() {
      $scope.teamList = $scope.leagueMatch.division.teams;
      $scope.homeTeamList = $scope.teamList;
      $scope.awayTeamList = $scope.teamList;

      $scope.leagueMatch.homeTeam = undefined;
      $scope.leagueMatch.awayTeam = undefined;
      $scope.leagueMatch.venue = '';
      $scope.homeTeamMasterListPlayers1 = [];
      $scope.homeTeamMasterListPlayers2 = [];
      $scope.awayTeamMasterListPlayers1 = [];
      $scope.awayTeamMasterListPlayers2 = [];
      $scope.homeTeamAvailablePlayers1 = [];
      $scope.homeTeamAvailablePlayers2 = [];
      $scope.awayTeamAvailablePlayers1 = [];
      $scope.awayTeamAvailablePlayers2 = [];
    };

    $scope.getHomeTeamText = function() {
      if ($scope.leagueMatch.homeTeam !== undefined) {
        return $scope.leagueMatch.homeTeam.teamName;
      } else {
        return 'Choose home team';
      }
    };

    $scope.getAwayTeamText = function() {
      if ($scope.leagueMatch.awayTeam !== undefined) {
        return $scope.leagueMatch.awayTeam.teamName;
      } else {
        return 'Choose away team';
      }
    };

    $scope.homeTeamChosen = function() {
      $scope.awayTeamList = $scope.teamList.slice(0);

      var club = clubsService.getClub($scope.leagueMatch.homeTeam.clubID);
      if (club && club.venue) {
        $scope.leagueMatch.venue = club.venue;
      }

      var index = $scope.awayTeamList.indexOf($scope.leagueMatch.homeTeam);
      if (index > -1) {
        $scope.awayTeamList.splice(index, 1);
      }

      if ($scope.leagueMatch.matchDiscipline !== 'Mixed Doubles') {
        $scope.homeTeamMasterListPlayers1 = playerService.getPlayersForClub($scope.leagueMatch.homeTeam.clubID, $scope.leagueMatch.matchDiscipline, undefined, true);
        $scope.homeTeamMasterListPlayers2 = $scope.homeTeamMasterListPlayers1;
      } else {
        $scope.homeTeamMasterListPlayers1 = playerService.getPlayersForClub($scope.leagueMatch.homeTeam.clubID, $scope.leagueMatch.matchDiscipline, 'Male', true);
        $scope.homeTeamMasterListPlayers2 = playerService.getPlayersForClub($scope.leagueMatch.homeTeam.clubID, $scope.leagueMatch.matchDiscipline, 'Female', true);
      }
      clearPlayers(true);

      $scope.homeTeamAbbreviation = teamsService.getTeamAbbreviation($scope.leagueMatch.homeTeam.id);
    };

    $scope.awayTeamChosen = function() {
      $scope.homeTeamList = $scope.teamList.slice(0);

      var index = $scope.homeTeamList.indexOf($scope.leagueMatch.awayTeam);
      if (index > -1) {
        $scope.homeTeamList.splice(index, 1);
      }

      if ($scope.leagueMatch.matchDiscipline !== 'Mixed Doubles') {
        $scope.awayTeamMasterListPlayers1 = playerService.getPlayersForClub($scope.leagueMatch.awayTeam.clubID, $scope.leagueMatch.matchDiscipline, undefined, true);
        $scope.awayTeamMasterListPlayers2 = $scope.awayTeamMasterListPlayers1;
      } else {
        $scope.awayTeamMasterListPlayers1 = playerService.getPlayersForClub($scope.leagueMatch.awayTeam.clubID, $scope.leagueMatch.matchDiscipline, 'Male', true);
        $scope.awayTeamMasterListPlayers2 = playerService.getPlayersForClub($scope.leagueMatch.awayTeam.clubID, $scope.leagueMatch.matchDiscipline, 'Female', true);
      }
      clearPlayers(false);

      $scope.awayTeamAbbreviation = teamsService.getTeamAbbreviation($scope.leagueMatch.awayTeam.id);
    };

    $scope.playerChosen = function(player) {
      if ($scope.leagueMatch[player] && $scope.leagueMatch[player].id === -1) {
        $scope.leagueMatch[player] = undefined;
      }

      // take a copy of the master list of players
      $scope.homeTeamAvailablePlayers1 = $scope.homeTeamMasterListPlayers1.slice(0);
      $scope.homeTeamAvailablePlayers2 = $scope.homeTeamMasterListPlayers2.slice(0);

      updatePlayerLists('homePair1Player1');
      updatePlayerLists('homePair1Player2');
      updatePlayerLists('homePair2Player1');
      updatePlayerLists('homePair2Player2');
      updatePlayerLists('homePair3Player1');
      updatePlayerLists('homePair3Player2');

      // take a copy of the master list of players
      $scope.awayTeamAvailablePlayers1 = $scope.awayTeamMasterListPlayers1.slice(0);
      $scope.awayTeamAvailablePlayers2 = $scope.awayTeamMasterListPlayers2.slice(0);

      updatePlayerLists('awayPair1Player1');
      updatePlayerLists('awayPair1Player2');
      updatePlayerLists('awayPair2Player1');
      updatePlayerLists('awayPair2Player2');
      updatePlayerLists('awayPair3Player1');
      updatePlayerLists('awayPair3Player2');
    };

    function updatePlayerLists(player) {
      var index;

      switch(player) {
        case 'homePair1Player1':
        case 'homePair1Player2':
        case 'homePair2Player1':
        case 'homePair2Player2':
        case 'homePair3Player1':
        case 'homePair3Player2':
            // now remove players already chosen from the lists
            index = $scope.homeTeamAvailablePlayers1.indexOf($scope.leagueMatch[player]);
            if (index > -1) {
              $scope.homeTeamAvailablePlayers1.splice(index, 1);
            }
            index = $scope.homeTeamAvailablePlayers2.indexOf($scope.leagueMatch[player]);
            if (index > -1) {
              $scope.homeTeamAvailablePlayers2.splice(index, 1);
            }
            break;
        case 'awayPair1Player1':
        case 'awayPair1Player2':
        case 'awayPair2Player1':
        case 'awayPair2Player2':
        case 'awayPair3Player1':
        case 'awayPair3Player2':
          // now remove players already chosen from the lists
          index = $scope.awayTeamAvailablePlayers1.indexOf($scope.leagueMatch[player]);
          if (index > -1) {
            $scope.awayTeamAvailablePlayers1.splice(index, 1);
          }
          index = $scope.awayTeamAvailablePlayers2.indexOf($scope.leagueMatch[player]);
          if (index > -1) {
            $scope.awayTeamAvailablePlayers2.splice(index, 1);
          }
          break;
      }
    }

    function clearPlayers(home) {
      if (home) {
        $scope.leagueMatch.homePair1Player1 = undefined;
        $scope.leagueMatch.homePair1Player2 = undefined;
        $scope.leagueMatch.homePair2Player1 = undefined;
        $scope.leagueMatch.homePair2Player2 = undefined;
        $scope.leagueMatch.homePair3Player1 = undefined;
        $scope.leagueMatch.homePair3Player2 = undefined;

        $scope.homeTeamAvailablePlayers1 = $scope.homeTeamMasterListPlayers1.slice(0);
        $scope.homeTeamAvailablePlayers2 = $scope.homeTeamMasterListPlayers2.slice(0);
      } else {
        $scope.leagueMatch.awayPair1Player1 = undefined;
        $scope.leagueMatch.awayPair1Player2 = undefined;
        $scope.leagueMatch.awayPair2Player1 = undefined;
        $scope.leagueMatch.awayPair2Player2 = undefined;
        $scope.leagueMatch.awayPair3Player1 = undefined;
        $scope.leagueMatch.awayPair3Player2 = undefined;

        $scope.awayTeamAvailablePlayers1 = $scope.awayTeamMasterListPlayers1.slice(0);
        $scope.awayTeamAvailablePlayers2 = $scope.awayTeamMasterListPlayers2.slice(0);
      }
    }

    $scope.scoreChange = function(game) {
      var match;
      switch(game.substring(0, 2)) {
        case 'M1':
          match = 'match1';
          break;
        case 'M2':
          match = 'match2';
          break;
        case 'M3':
          match = 'match3';
          break;
        case 'M4':
          match = 'match4';
          break;
        case 'M5':
          match = 'match5';
          break;
        case 'M6':
          match = 'match6';
          break;
        case 'M7':
          match = 'match7';
          break;
        case 'M8':
          match = 'match8';
          break;
        case 'M9':
          match = 'match9';
          break;
      }

      var thisTeam, otherTeam;
      if (game.substring(2, 4) === 'T1') {
        thisTeam = 'team1';
        otherTeam = 'team2';
      } else {
        thisTeam = 'team2';
        otherTeam = 'team1';
      }

      var score = game.substring(4, 6);
      if (score === 'S1') {
        score = 'Score1';
      } else if (score === 'S2') {
        score = 'Score2';
      } else {
        score = 'Score3';
      }

      $scope.leagueMatch[match][otherTeam + score] = getWinningScoreFromLosingScore($scope.leagueMatch[match][thisTeam + score]);

      matchUtilityService.calculateMatchScores($scope.leagueMatch);
    };

    function getWinningScoreFromLosingScore(losingScore) {
      if (losingScore < 20) {
        return 21;
      } else if (losingScore < 29) {
        return Number(losingScore) + 2;
      } else {
        return 30;
      }
    }

    $scope.getPlayerText = function(player) {
      if ($scope.leagueMatch && $scope.leagueMatch[player]) {
        return $scope.leagueMatch[player].name;
      } else {
        return 'Choose player';
      }
    };

    $scope.getPlayerDisplay = function(playerID, includeGrade) {
      var grade;
      var player = playerService.getPlayer(playerID);
      if ($scope.leagueMatch && player) {
        if (includeGrade) {
          if ($scope.leagueMatch.matchType.indexOf('mixed') !== -1) {
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

    $scope.getWonByText = function(match) {
      if ($scope.homeTeamAbbreviation === '' || $scope.awayTeamAbbreviation === '' || !matchUtilityService.isRubberComplete($scope.leagueMatch[match])) {
        return '';
      }
      if (match !== undefined) {
        var wonByText = 'Won by:';
        if (matchUtilityService.getMatchResult($scope.leagueMatch[match].team1Score1, $scope.leagueMatch[match].team2Score1, $scope.leagueMatch[match].team1Score2, $scope.leagueMatch[match].team2Score2,
            $scope.leagueMatch[match].team1Score3, $scope.leagueMatch[match].team2Score3)) {
          return wonByText + $scope.homeTeamAbbreviation;
        } else {
          return wonByText + $scope.awayTeamAbbreviation;
        }
      } else {
        return '';
      }
    };

    $scope.formatMatchDate = function (date) {
      var returnDate = new Date(parseInt(date));
      return returnDate.getDate() + '/' + (returnDate.getMonth() + 1) + '/' + returnDate.getFullYear();
    };


    $scope.matchConceded = function(match) {
      if (match !== undefined) {
        return match.matchPlayed !== 'true';
      } else {
        return false;
      }
    };

    $scope.displayHelp = function() {
      $mdBottomSheet.show({
        templateUrl: 'views/help.html',
        clickOutsideToClose: true
      });
    };

    $scope.submitMatch = function() {

      if (applyGradesToUngradedPlayers()) {
        // Clear any error strings hanging around
        var errorStrings = validateLeagueMatchService.validateLeagueMatch($scope.leagueMatch, leagueMatchForm.captainEmail.validationMessage);
        if (errorStrings.length > 0) {
          $mdBottomSheet.show({
            templateUrl: 'views/matchValidationErrors.html',
            controller: 'MatchValidationErrorsCtrl',
            clickOutsideToClose: true
          });
        } else {
          $scope.loadingData = true;
          $scope.submittingLeagueMatch = true;

          $scope.loadingPromise = dataService.submitLeagueMatch($scope.leagueMatch)
            .then(function() {
              $scope.submissionSuccessful = true;
              $scope.submissionFailed = false;
              $scope.loadingData = false;
            }, function() {
              $scope.submissionFailed = true;
              $scope.submissionSuccessful = false;
              $scope.loadingData = false;
            });
        }
      }
    };

    function applyGradesToUngradedPlayers() {

      var homeAverageGrade = gradeService.getAverageGrade(gradeService.getTeamGradeArray($scope.leagueMatch, true));
      var awayAverageGrade = gradeService.getAverageGrade(gradeService.getTeamGradeArray($scope.leagueMatch, false));

      var playersToUpdate = [];

      var gradeAttribute = 'doublesGrade';
      if ($scope.leagueMatch.matchDiscipline === 'Mixed Doubles') {
        gradeAttribute = 'mixedGrade';
      }

      if (homeAverageGrade !== 'UG') {
        if ($scope.leagueMatch.homePair1Player1 && $scope.leagueMatch.homePair1Player1[gradeAttribute] === 'UG') {
          $scope.leagueMatch.homePair1Player1[gradeAttribute] = homeAverageGrade;
          playersToUpdate.push($scope.leagueMatch.homePair1Player1);
        }
        if ($scope.leagueMatch.homePair1Player2 && $scope.leagueMatch.homePair1Player2[gradeAttribute] === 'UG') {
          $scope.leagueMatch.homePair1Player2[gradeAttribute] = homeAverageGrade;
          playersToUpdate.push($scope.leagueMatch.homePair1Player2);
        }
        if ($scope.leagueMatch.homePair2Player1 && $scope.leagueMatch.homePair2Player1[gradeAttribute] === 'UG') {
          $scope.leagueMatch.homePair2Player1[gradeAttribute] = homeAverageGrade;
          playersToUpdate.push($scope.leagueMatch.homePair2Player1);
        }
        if ($scope.leagueMatch.homePair2Player2 && $scope.leagueMatch.homePair2Player2[gradeAttribute] === 'UG') {
          $scope.leagueMatch.homePair2Player2[gradeAttribute] = homeAverageGrade;
          playersToUpdate.push($scope.leagueMatch.homePair2Player2);
        }
        if ($scope.leagueMatch.homePair3Player1 && $scope.leagueMatch.homePair3Player1[gradeAttribute] === 'UG') {
          $scope.leagueMatch.homePair3Player1[gradeAttribute] = homeAverageGrade;
          playersToUpdate.push($scope.leagueMatch.homePair3Player1);
        }
        if ($scope.leagueMatch.homePair3Player2 && $scope.leagueMatch.homePair3Player2[gradeAttribute] === 'UG') {
          $scope.leagueMatch.homePair3Player2[gradeAttribute] = homeAverageGrade;
          playersToUpdate.push($scope.leagueMatch.homePair3Player2);
        }
      }
      if (awayAverageGrade !== 'UG') {
        if ($scope.leagueMatch.awayPair1Player1 && $scope.leagueMatch.awayPair1Player1[gradeAttribute] === 'UG') {
          $scope.leagueMatch.awayPair1Player1[gradeAttribute] = awayAverageGrade;
          playersToUpdate.push($scope.leagueMatch.awayPair1Player1);
        }
        if ($scope.leagueMatch.awayPair1Player2 && $scope.leagueMatch.awayPair1Player2[gradeAttribute] === 'UG') {
          $scope.leagueMatch.awayPair1Player2[gradeAttribute] = awayAverageGrade;
          playersToUpdate.push($scope.leagueMatch.awayPair1Player2);
        }
        if ($scope.leagueMatch.awayPair2Player1 && $scope.leagueMatch.awayPair2Player1[gradeAttribute] === 'UG') {
          $scope.leagueMatch.awayPair2Player1[gradeAttribute] = awayAverageGrade;
          playersToUpdate.push($scope.leagueMatch.awayPair2Player1);
        }
        if ($scope.leagueMatch.awayPair2Player2 && $scope.leagueMatch.awayPair2Player2[gradeAttribute] === 'UG') {
          $scope.leagueMatch.awayPair2Player2[gradeAttribute] = awayAverageGrade;
          playersToUpdate.push($scope.leagueMatch.awayPair2Player2);
        }
        if ($scope.leagueMatch.awayPair3Player1 && $scope.leagueMatch.awayPair3Player1[gradeAttribute] === 'UG') {
          $scope.leagueMatch.awayPair3Player1[gradeAttribute] = awayAverageGrade;
          playersToUpdate.push($scope.leagueMatch.awayPair3Player1);
        }
        if ($scope.leagueMatch.awayPair3Player2 && $scope.leagueMatch.awayPair3Player2[gradeAttribute] === 'UG') {
          $scope.leagueMatch.awayPair3Player2[gradeAttribute] = awayAverageGrade;
          playersToUpdate.push($scope.leagueMatch.awayPair3Player2);
        }
      }

      if (playersToUpdate.length > 0) {

        $scope.loadingData = true;

        $scope.loadingPromise = dataService.updatePlayers(playersToUpdate)
          .then(function() {
            $scope.loadingData = false;
            $scope.submitMatch();
          }, function() {
            $scope.loadingData = false;
            $scope.submitMatch();
          });

        return false;
      } else {
        return true;
      }
    }

    $scope.resetMatch = function() {
      reset();
      $scope.leagueMatchForm.$setPristine();
      $scope.leagueMatchForm.$setUntouched();
    };

    $scope.submitAnotherMatch = function() {
      $scope.submittingLeagueMatch = false;
      $scope.submissionSuccessful = false;
      $scope.submissionFailed = false;
      $scope.resetMatch();
    };

    $scope.resubmitMatch = function() {
      $scope.submittingLeagueMatch = false;
      $scope.submissionSuccessful = false;
      $scope.submissionFailed = false;
      $scope.submitMatch();
    };

  });
