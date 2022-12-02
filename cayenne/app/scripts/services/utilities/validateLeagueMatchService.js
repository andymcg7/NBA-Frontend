'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:validateLeagueMatchService
 * @description
 * # validateLeagueMatchService
 * Service to validate a league match
 */

angular.module('NBAApp')
  .service('validateLeagueMatchService', function(dataService, leagueMatchesService, matchUtilityService) {

    var errorStrings = [];

    var missingMatchDateString = 'Please enter a date for this match.';
    var invalidDateErrorString = 'Please enter a valid match date.';
    var invalidFutureDateErrorString = 'You cannot enter a match date that is in the future.';

    function validateLeagueMatch(leagueMatch, message) {
      errorStrings = [];
      validateMatchType(leagueMatch);
      validateDivision(leagueMatch);
      validateMatchDate(leagueMatch.matchDate, dataService.getSystemBaseDate(), dataService.getServerTime());
      validateCaptainEmailAddress(message);
      validateTeams(leagueMatch);

      // now validate each rubber in the league match
      // var outcome = true;

      // check any player names entered are correct etc
      //outcome = checkAllPlayerNames();

      // if we have the special case of 2 pairs vs 2 pairs then we should only check certain matches
      if (checkForSpecialCase(leagueMatch)) {
        validateIndividualMatch(leagueMatch.match1, 1, leagueMatch.homePair1Player1, leagueMatch.homePair1Player2, leagueMatch.awayPair1Player1, leagueMatch.awayPair1Player2, leagueMatch.match1.team1Score1, leagueMatch.match1.team2Score1, leagueMatch.match1.team1Score2,
          leagueMatch.match1.team2Score2, leagueMatch.match1.team1Score3, leagueMatch.match1.team2Score3);
        validateIndividualMatch(leagueMatch.match2, 2, leagueMatch.homePair2Player1, leagueMatch.homePair2Player2, leagueMatch.awayPair2Player1, leagueMatch.awayPair2Player2, leagueMatch.match2.team1Score1, leagueMatch.match2.team2Score1, leagueMatch.match2.team1Score2,
          leagueMatch.match2.team2Score2, leagueMatch.match2.team1Score3, leagueMatch.match2.team2Score3);
        validateIndividualMatch(leagueMatch.match4, 4, leagueMatch.homePair2Player1, leagueMatch.homePair2Player2, leagueMatch.awayPair1Player1, leagueMatch.awayPair1Player4, leagueMatch.match4.team1Score1, leagueMatch.match4.team2Score1, leagueMatch.match4.team1Score2,
          leagueMatch.match4.team2Score2, leagueMatch.match4.team1Score3, leagueMatch.match4.team2Score3);
        validateIndividualMatch(leagueMatch.match8, 8, leagueMatch.homePair1Player1, leagueMatch.homePair1Player2, leagueMatch.awayPair2Player1, leagueMatch.awayPair2Player4, leagueMatch.match8.team1Score1, leagueMatch.match8.team2Score1, leagueMatch.match8.team1Score2,
          leagueMatch.match8.team2Score2, leagueMatch.match8.team1Score3, leagueMatch.match8.team2Score3);
      } else {
        validateIndividualMatch(leagueMatch.match1, 1, leagueMatch.homePair1Player1, leagueMatch.homePair1Player2, leagueMatch.awayPair1Player1, leagueMatch.awayPair1Player2, leagueMatch.match1.team1Score1, leagueMatch.match1.team2Score1, leagueMatch.match1.team1Score2,
          leagueMatch.match1.team2Score2, leagueMatch.match1.team1Score3, leagueMatch.match1.team2Score3);
        validateIndividualMatch(leagueMatch.match2, 2, leagueMatch.homePair2Player1, leagueMatch.homePair2Player2, leagueMatch.awayPair2Player1, leagueMatch.awayPair2Player2, leagueMatch.match2.team1Score1, leagueMatch.match2.team2Score1, leagueMatch.match2.team1Score2,
          leagueMatch.match2.team2Score2, leagueMatch.match2.team1Score3, leagueMatch.match2.team2Score3);
        validateIndividualMatch(leagueMatch.match3, 3, leagueMatch.homePair3Player1, leagueMatch.homePair3Player2, leagueMatch.awayPair3Player1, leagueMatch.awayPair3Player2, leagueMatch.match3.team1Score1, leagueMatch.match3.team2Score1, leagueMatch.match3.team1Score2,
          leagueMatch.match3.team2Score2, leagueMatch.match3.team1Score3, leagueMatch.match3.team2Score3);
        validateIndividualMatch(leagueMatch.match4, 4, leagueMatch.homePair2Player1, leagueMatch.homePair2Player2, leagueMatch.awayPair1Player1, leagueMatch.awayPair1Player2, leagueMatch.match4.team1Score1, leagueMatch.match4.team2Score1, leagueMatch.match4.team1Score2,
          leagueMatch.match4.team2Score2, leagueMatch.match4.team1Score3, leagueMatch.match4.team2Score3);
        validateIndividualMatch(leagueMatch.match5, 5, leagueMatch.homePair3Player1, leagueMatch.homePair3Player2, leagueMatch.awayPair2Player1, leagueMatch.awayPair2Player2, leagueMatch.match5.team1Score1, leagueMatch.match5.team2Score1, leagueMatch.match5.team1Score2,
          leagueMatch.match5.team2Score2, leagueMatch.match5.team1Score3, leagueMatch.match5.team2Score3);
        validateIndividualMatch(leagueMatch.match6, 6, leagueMatch.homePair1Player1, leagueMatch.homePair1Player2, leagueMatch.awayPair3Player1, leagueMatch.awayPair3Player2, leagueMatch.match6.team1Score1, leagueMatch.match6.team2Score1, leagueMatch.match6.team1Score2,
          leagueMatch.match6.team2Score2, leagueMatch.match6.team1Score3, leagueMatch.match6.team2Score3);
        validateIndividualMatch(leagueMatch.match7, 7, leagueMatch.homePair3Player1, leagueMatch.homePair3Player2, leagueMatch.awayPair1Player1, leagueMatch.awayPair1Player2, leagueMatch.match7.team1Score1, leagueMatch.match7.team2Score1, leagueMatch.match7.team1Score2,
          leagueMatch.match7.team2Score2, leagueMatch.match7.team1Score3, leagueMatch.match7.team2Score3);
        validateIndividualMatch(leagueMatch.match8, 8, leagueMatch.homePair1Player1, leagueMatch.homePair1Player2, leagueMatch.awayPair2Player1, leagueMatch.awayPair2Player2, leagueMatch.match8.team1Score1, leagueMatch.match8.team2Score1, leagueMatch.match8.team1Score2,
          leagueMatch.match8.team2Score2, leagueMatch.match8.team1Score3, leagueMatch.match8.team2Score3);
        validateIndividualMatch(leagueMatch.match9, 9, leagueMatch.homePair2Player1, leagueMatch.homePair2Player2, leagueMatch.awayPair3Player1, leagueMatch.awayPair3Player2, leagueMatch.match9.team1Score1, leagueMatch.match9.team2Score1, leagueMatch.match9.team1Score2,
          leagueMatch.match9.team2Score2, leagueMatch.match9.team1Score3, leagueMatch.match9.team2Score3);
      }

      return errorStrings;
    }

    function validateMatchType(leagueMatch) {
      if (!leagueMatch.matchDiscipline) {
        errorStrings.push('Please choose a match type, mens, ladies or mixed doubles.');
      }
    }

    function validateDivision(leagueMatch) {
      if (!leagueMatch.division) {
        errorStrings.push('Please choose a division for this match.');
      }
    }

    function validateMatchDate(matchDate, baseDate, serverDate) {
      // check if we have a valid date
      // a valid date is greater than the base date and lower than the server date
      var dateValue;
      if (matchDate && matchDate !== null) {
        dateValue = matchDate.getTime();
      } else {
        errorStrings.push(missingMatchDateString);
        return;
      }


      if (dateValue < baseDate) {
        errorStrings.push(invalidDateErrorString);
      } else if ( dateValue > serverDate) {
        errorStrings.push(invalidFutureDateErrorString);
      }
    }

    function validateCaptainEmailAddress(message) {
        if (message === 'Please fill in this field.') {
          errorStrings.push('Please enter a valid email address');
        } else if (message !== '') {
          errorStrings.push(message);
        }
    }

    function validateTeams(leagueMatch) {
      if (leagueMatch.homeTeam === undefined) {
        errorStrings.push('Please choose a home team for the match.');
      }
      if (leagueMatch.awayTeam === undefined) {
        errorStrings.push('Please choose an away team for the match.');
      }
      if (leagueMatch.homeTeam && leagueMatch.awayTeam && leagueMatchesService.checkIfMatchAlreadyExists(leagueMatch)) {
        errorStrings.push('This league match has already been entered.');
      }
    }

    // check if a match is 21-0 21-0 to either side, otherwise return the appropriate error code
     function checkForWalkover(team1Score1, team2Score1, team1Score2, team2Score2, team1Score3, team2Score3) {
      if (team1Score1 === 21) {
        if (team2Score1 === 0 && team2Score2 === 0 && team2Score3 === 0 && team1Score2 === 21 && team1Score3 === 0) {
          return false;
        }
      } else if (team2Score1 === 21) {
        if (team1Score1 === 0 && team1Score2 === 0 && team1Score3 === 0 && team2Score2 === 21 && team2Score3 === 0) {
          return false;
        }
      }

      return true;
    }

    function isPlayerMissing(player) {
      return (player === undefined || player === null);
    }

    function validateIndividualMatch(match, matchNumber, homePairPlayer1, homePairPlayer2, awayPairPlayer1, awayPairPlayer2,
      homeSet1Score, awaySet1Score, homeSet2Score, awaySet2Score, homeSet3Score, awaySet3Score) {
      var continueValidating = true;

      // first check if the match was a walkover or not - if it is, check the score is 21-0 21-0
      // If not, its not a valid match
      if (!match.matchPlayed)
      {
        var walkoverResult = checkForWalkover(homeSet1Score, awaySet1Score, homeSet2Score, awaySet2Score, homeSet3Score, awaySet3Score);
        if (!walkoverResult) {
          errorStrings.push('Match ' + matchNumber + 'If this match was conceded, the score must be entered as 21-0 21-0 to the winning side. Otherwise uncheck the box and enter the score as normal.');
        } else {
          return true;
        }
      }

      // If the match isn't a walkover, and has no players, and the scores are 0-0 then the match is OK
      if (match.player1 === 0 && match.partner1 === 0 && match.player2 === 0 && match.partner2 === 0) {
        if (match.team1Score1 === 0 && match.team1Score2 === 0 && match.team1Score3 === 0 &&
          match.team2Score1 === 0 && match.team2Score2 === 0 && match.team2Score3 === 0) {
          return true;
        }
      }

      // if one or more players from team 1 are missing from a match and the players
      // from team 2 are present then it must be a walkover to team 2
      if (isPlayerMissing(homePairPlayer1) || isPlayerMissing(homePairPlayer2)) {
        if (!isPlayerMissing(awayPairPlayer1) && !isPlayerMissing(awayPairPlayer2)) {
          if (match.matchPlayed) {
            errorStrings.push('Match ' + matchNumber + '-Please check the outcome of this match -does it require checking the conceded option? One or more player names seem to be missing.');
            continueValidating = false;
          }
        } else {
          errorStrings.push('Match ' + matchNumber + '-There are players missing for this match and you have not checked the conceded option. Please check this result again.');
          continueValidating = false;
        }
      } else if (isPlayerMissing(awayPairPlayer1) || isPlayerMissing(awayPairPlayer2)) {
        if (!isPlayerMissing(homePairPlayer1) && !isPlayerMissing(homePairPlayer2)) {
          errorStrings.push('Match ' + matchNumber + '-Please check the outcome of this match -does it require checking the conceded option? One or more player names seem to be missing.');
          continueValidating = false;
        } else {
          errorStrings.push('Match ' + matchNumber + '-There are players missing for this match and you have not checked the conceded option. Please check this result again.');
          continueValidating = false;
        }
      }

      if (!continueValidating) {
        return false;
      }

      var result = matchUtilityService.validateMatchOutcome(homeSet1Score, awaySet1Score, homeSet2Score, awaySet2Score, homeSet3Score, awaySet3Score);
      if (result !== 0) {
        switch(result) {
          case 1:
            errorStrings.push('Match ' + matchNumber + '-A score cannot be higher than 30 points.');
            break;
          case 2:
            errorStrings.push('Match ' + matchNumber + '-One score must be at least 21 points for a set.');
            break;
          case 3:
            errorStrings.push('Match ' + matchNumber + '-There must be at least 2 clear points between the set scores in this case.');
            break;
          case 4:
            errorStrings.push('Match ' + matchNumber + '-There must be no more than 2 points difference between the set scores in this case.');
            break;
          case 5:
            errorStrings.push('Match ' + matchNumber + '-A set cannot have 2 scores that are the same.');
            break;
          case 6:
            errorStrings.push('Match ' + matchNumber + '-General error.');
            break;
        }
        return false;
      } else {
        return true;
      }
    }

    //function checkAllPlayerNames(leagueMatch) {
    //  var outcome = true;
    //
    //  if (!leagueMatch.homePair1Player1) {
    //    outcome = false;
    //  }
    //  if (!leagueMatch.homePair1Player2) {
    //    outcome = false;
    //  }
    //  if (!leagueMatch.homePair2Player1) {
    //    outcome = false;
    //  }
    //  if (!leagueMatch.homePair2Player2) {
    //    outcome = false;
    //  }
    //  if (!leagueMatch.homePair3Player1) {
    //    outcome = false;
    //  }
    //  if (!leagueMatch.homePair3Player2) {
    //    outcome = false;
    //  }
    //  if (!leagueMatch.awayPair1Player1) {
    //    outcome = false;
    //  }
    //  if (!leagueMatch.awayPair1Player2) {
    //    outcome = false;
    //  }
    //  if (!leagueMatch.awayPair2Player1) {
    //    outcome = false;
    //  }
    //  if (!leagueMatch.awayPair2Player2) {
    //    outcome = false;
    //  }
    //  if (!leagueMatch.awayPair3Player1) {
    //    outcome = false;
    //  }
    //  if (!leagueMatch.awayPair3Player2) {
    //    outcome = false;
    //  }
    //
    //  return outcome;
    //}

    function checkForSpecialCase(leagueMatch) {
      if (!leagueMatch.homePair3Player1 &&
        !leagueMatch.homePair3Player2 &&
        !leagueMatch.awayPair3Player1 &&
        !leagueMatch.awayPair3Player2) {
        return true;
      } else {
        return false;
      }
    }

    return {
      validateLeagueMatch: validateLeagueMatch,
      getErrorStrings: function() { return errorStrings; }
    };

  });
