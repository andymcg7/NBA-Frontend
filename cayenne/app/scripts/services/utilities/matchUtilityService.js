'use strict';

angular.module('NBAApp')
  .service('matchUtilityService', function(playerService) {

    function isMatchThreeSets (team1Score1, team2Score1, team1Score2, team2Score2) {
      var team1Sets = 0;
      var team2Sets = 0;

      if (parseInt(team1Score1) > parseInt(team2Score1))
      {
        team1Sets++;
      }
      else
      {
        team2Sets++;
      }
      if (parseInt(team1Score2) > parseInt(team2Score2))
      {
        team1Sets++;
      }
      else
      {
        team2Sets++;
      }

      return team1Sets === team2Sets;
    }

    function getShortMatchResult(match, playerId) {
      if (match.player1 === playerId || match.partner1 === playerId) {
        return (getMatchResult(match.team1Score1, match.team2Score1, match.team1Score2, match.team2Score2, match.team1Score3, match.team2Score3)) ? 'Won' : 'Lost';
      } else {
        return (getMatchResult(match.team1Score1, match.team2Score1, match.team1Score2, match.team2Score2, match.team1Score3, match.team2Score3)) ? 'Lost' : 'Won';
      }
    }

// returns true if team 1 won the match
    function getMatchResult(team1Score1, team2Score1, team1Score2, team2Score2, team1Score3, team2Score3) {
      var team1Sets = 0;
      var team2Sets = 0;

      if (parseInt(team1Score1) > parseInt(team2Score1))
      {
        team1Sets++;
      }
      else
      {
        team2Sets++;
      }
      if (parseInt(team1Score2) > parseInt(team2Score2))
      {
        team1Sets++;
      }
      else
      {
        team2Sets++;
      }

      if (team1Sets === team2Sets)
      {
        if (parseInt(team1Score3) > parseInt(team2Score3))
        {
          team1Sets++;
        }
        else
        {
          team2Sets++;
        }
      }

      return team1Sets > team2Sets;
    }

    function getMatchScore(match, player) {
      var score = '';

      if (match.player1 === player.id || match.partner1 === player.id) {
        score = match.team1Score1 + '-' + match.team2Score1 + ' ' + match.team1Score2 + '-' + match.team2Score2;
        if (isMatchThreeSets(match.team1Score1, match.team2Score1, match.team1Score2, match.team2Score2)) {
          score += ' ' + match.team1Score3 + '-' + match.team2Score3;
        }
      } else {
        score = match.team2Score1 + '-' + match.team1Score1 + ' ' + match.team2Score2 + '-' + match.team1Score2;
        if (isMatchThreeSets(match.team1Score1, match.team2Score1, match.team1Score2, match.team2Score2)) {
          score += ' ' + match.team2Score3 + '-' + match.team1Score3;
        }
      }
      return score;
    }

    function getOpponentName(match, player) {
      if (match.discipline.indexOf('Doubles') !== -1) {
        if (match.player1 === player.id || match.partner1 === player.id) {
          return {'opponent1': playerService.getPlayer(match.player2).name, 'opponent2': playerService.getPlayer(match.partner2).name};
        } else {
          return {'opponent1': playerService.getPlayer(match.player1).name, 'opponent2': playerService.getPlayer(match.partner1).name};
        }
      } else {
        if (match.player1 === player.id) {
          return playerService.getPlayer(match.player2).name;
        } else {
          return playerService.getPlayer(match.player1).name;
        }
      }
    }

    function getPartnerGrade(match, player) {
      var field = {};
      if (match.discipline === 'Mixed Doubles') {
        field = 'mixedGrade';
      } else {
        field = 'doublesGrade';
      }

      if (match.player1 === player.id) {
        return playerService.getPlayer(match.partner1)[field];
      } else if (match.partner1 === player.id) {
        return playerService.getPlayer(match.player1)[field];
      } else if (match.player2 === player.id) {
        return playerService.getPlayer(match.partner2)[field];
      } else if (match.partner2 === player.id) {
        return playerService.getPlayer(match.player2)[field];
      } else {
        return '';
      }
    }

    function getOpponentGrade(match, player) {
      var field = {};
      if (match.discipline === 'Mixed Doubles') {
        field = 'mixedGrade';
      } else {
        field = 'doublesGrade';
      }

      if (match.discipline.indexOf('Doubles') !== -1) {
        if (match.player1 === player.id || match.partner1 === player.id) {
          return playerService.getPlayer(match.player2)[field] + '/ ' + playerService.getPlayer(match.partner2)[field];
        } else {
          return playerService.getPlayer(match.player1)[field] + '/ ' + playerService.getPlayer(match.partner1)[field];
        }
      } else {
        if (match.player1 === player.id) {
          return playerService.getPlayer(match.player2)[field];
        } else {
          return playerService.getPlayer(match.player1)[field];
        }
      }
    }

    function getOpponentNameWithLink(match, player) {
      if (match.discipline.indexOf('Doubles') !== -1) {
        if (match.player1 === player.id || match.partner1 === player.id) {
          return '<a href="#player/' + match.player2 + '">' + playerService.getPlayer(match.player2).name + '</a>/ ' + '<a href="#player?playerid=' + match.partner2 + '">' + playerService.getPlayer(match.partner2).name + '</a>';
        } else {
          return '<a href="#player/' + match.player1 + '">' + playerService.getPlayer(match.player1).name + '</a>/ ' + '<a href="#player?playerid=' + match.partner1 + '">' + playerService.getPlayer(match.partner1).name + '</a>';
        }
      } else {
        if (match.player1 === player.id) {
          return '<a href="#/player/' + match.player2 + '">' + playerService.getPlayer(match.player2).name + '</a>';
          //return playerService.getPlayer(match.player2).name;
        } else {
          return '<a href="#/player/' + match.player1 + '">' + playerService.getPlayer(match.player1).name + '</a>';
          //return playerService.getPlayer(match.player1).name;
        }
      }
    }

    function getPartnerName(match, player) {
      var field = {};
      if (match.discipline === 'Mixed Doubles') {
        field = 'mixedGrade';
      } else {
        field = 'doublesGrade';
      }

      if (match.player1 === player.id) {
        return playerService.getPlayer(match.partner1).name;
      } else if (match.partner1 === player.id) {
        return playerService.getPlayer(match.player1).name;
      } else if (match.player2 === player.id) {
        return playerService.getPlayer(match.partner2).name;
      } else {
        return playerService.getPlayer(match.player2).name;
      }
    }

    function getPartnerID(match, player) {
      if (match.player1 === player.id) {
        return match.partner1;
      } else if (match.partner1 === player.id) {
        return match.player1;
      } else if (match.player2 === player.id) {
        return match.partner2;
      } else {
        return match.player2;
      }
    }

    function getPartnerNameWithLink(match, player) {
      var field = {};
      if (match.discipline === 'Mixed Doubles') {
        field = 'mixedGrade';
      } else {
        field = 'doublesGrade';
      }

      if (match.player1 === player.id) {
        return '<a href="#player/' + match.partner1 + '">' + playerService.getPlayer(match.partner1).name + '</a>' + ' (' + playerService.getPlayer(match.partner1)[field] + ')';
      } else if (match.partner1 === player.id) {
        return '<a href="#player/' + match.player1 + '">' + playerService.getPlayer(match.player1).name + '</a>' + ' (' + playerService.getPlayer(match.player1)[field] + ')';
      } else if (match.player2 === player.id) {
        return '<a href="#player/' + match.partner2 + '">' + playerService.getPlayer(match.partner2).name + '</a>' + ' (' + playerService.getPlayer(match.partner2)[field] + ')';
      } else {
        return '<a href="#player/' + match.player2 + '">' + playerService.getPlayer(match.player2).name + '</a>' + ' (' + playerService.getPlayer(match.player2)[field] + ')';
      }
    }

    function getOpponentID(match, player) {
      if (match.discipline.indexOf('Doubles') !== -1) {
        if (match.player1 === player.id || match.partner1 === player.id) {
          return {'opponent': match.player2, 'partner': match.partner2};
        } else {
          return {'opponent': match.player1, 'partner': match.partner1};
        }
      } else {
        if (match.player1 === player.id) {
          return {'opponent': match.player2};
        } else {
          return {'opponent': match.player1};
        }
      }
    }

    function calculateMatchScores(leagueMatch) {
      leagueMatch.homeTeamLeaguePoints = 0;
      leagueMatch.awayTeamLeaguePoints = 0;
      leagueMatch.homeTeamRubbers = 0;
      leagueMatch.awayTeamRubbers = 0;
      leagueMatch.homeTeamSets = 0;
      leagueMatch.awayTeamSets = 0;
      leagueMatch.homeTeamPoints = 0;
      leagueMatch.awayTeamPoints = 0;

      scoreCalculation(leagueMatch, leagueMatch.match1);
      scoreCalculation(leagueMatch, leagueMatch.match2);
      scoreCalculation(leagueMatch, leagueMatch.match3);
      scoreCalculation(leagueMatch, leagueMatch.match4);
      scoreCalculation(leagueMatch, leagueMatch.match5);
      scoreCalculation(leagueMatch, leagueMatch.match6);
      scoreCalculation(leagueMatch, leagueMatch.match7);
      scoreCalculation(leagueMatch, leagueMatch.match8);
      scoreCalculation(leagueMatch, leagueMatch.match9);

      switch(leagueMatch.homeTeamRubbers) {
        case 0:
        case 1:
        case 2:
          leagueMatch.homeTeamLeaguePoints = 0;
          break;
        case 3:
        case 4:
          leagueMatch.homeTeamLeaguePoints = 1;
          break;
        case 5:
        case 6:
          leagueMatch.homeTeamLeaguePoints = 2;
          break;
        case 7:
        case 8:
        case 9:
          leagueMatch.homeTeamLeaguePoints = 3;
          break;
        default:
          break;
      }

      switch(leagueMatch.awayTeamRubbers) {
        case 0:
        case 1:
        case 2:
          leagueMatch.awayTeamLeaguePoints = 0;
          break;
        case 3:
        case 4:
          leagueMatch.awayTeamLeaguePoints = 1;
          break;
        case 5:
        case 6:
          leagueMatch.awayTeamLeaguePoints = 2;
          break;
        case 7:
        case 8:
        case 9:
          leagueMatch.awayTeamLeaguePoints = 3;
          break;
        default:
          break;
    }

    // special case to handle if each team only has 2 pairs
    if ((leagueMatch.homeTeamRubbers + leagueMatch.awayTeamRubbers) === 4) {
      switch(leagueMatch.homeTeamRubbers) {
        case 0:
        case 1:
          leagueMatch.homeTeamLeaguePoints = 0;
          break;
        case 2:
          leagueMatch.homeTeamLeaguePoints = 1;
          break;
        case 3:
        case 4:
          leagueMatch.homeTeamLeaguePoints = 2;
          break;
        default:
          break;
      }
      switch(leagueMatch.awayTeamRubbers) {
        case 0:
        case 1:
          leagueMatch.awayTeamLeaguePoints = 0;
          break;
        case 2:
          leagueMatch.awayTeamLeaguePoints = 1;
          break;
        case 3:
        case 4:
          leagueMatch.awayTeamLeaguePoints = 2;
          break;
        default:
          break;
      }
    }
  }

  function scoreCalculation(leagueMatch, match) {
      if (isRubberComplete(match)) {
          var homeSets = 0;
          var awaySets = 0;

        if (match.team1Score1 > match.team2Score1) {
          // increase the overall total
          leagueMatch.homeTeamSets++;

          // and the total for this rubber
          homeSets++;
        } else if (match.team2Score1 > match.team1Score1) {
          // increase the overall total
          leagueMatch.awayTeamSets++;

          // and the total for this rubber
          awaySets++;
        } else {
          // error
        }

        leagueMatch.homeTeamPoints += match.team1Score1;
        leagueMatch.awayTeamPoints += match.team2Score1;

        if (match.team1Score2 > match.team2Score2) {
          // increase the overall total
          leagueMatch.homeTeamSets++;

          // and the total for this rubber
          homeSets++;
        } else if (match.team2Score2 > match.team1Score2) {
          // increase the overall total
          leagueMatch.awayTeamSets++;

          // and the total for this rubber
          awaySets++;
        } else {
          // error
        }

        leagueMatch.homeTeamPoints += match.team1Score2;
        leagueMatch.awayTeamPoints += match.team2Score2;

        // check if we have a result already
        if (homeSets === 2) {
          leagueMatch.homeTeamRubbers++;

          match.wonBy = leagueMatch.homeTeam.abbreviation;
        } else if (awaySets === 2) {
          leagueMatch.awayTeamRubbers++;

          match.wonBy = leagueMatch.awayTeam.abbreviation;
        } else {
          if (match.team1Score3 > match.team2Score3) {
            // increase the overall total
            leagueMatch.homeTeamSets++;

            leagueMatch.homeTeamRubbers++;

            match.wonBy = leagueMatch.homeTeam.abbreviation;
          } else if (match.team2Score3 > match.team1Score3) {
            // increase the overall total
            leagueMatch.awayTeamSets++;

            leagueMatch.awayTeamRubbers++;

            match.wonBy = leagueMatch.awayTeam.abbreviation;
          } else {
            // error
          }

          leagueMatch.homeTeamPoints += match.team1Score3;
          leagueMatch.awayTeamPoints += match.team2Score3;
        }
      }
  }

    // Check that a rubber is completely valid before we add it to our totals
    function isRubberComplete(match) {
      var homeSets = 0;
      var awaySets = 0;

      if (!match) {
        return false;
      }

      if (match.team1Score1 > match.team2Score1) {
        if (match.team1Score1 < 21) {
          return false;
        }

        // and the total for this rubber
        homeSets++;
      } else if (match.team2Score1 > match.team1Score1) {
        if (match.team2Score1 < 21) {
          return false;
        }

        // and the total for this rubber
        awaySets++;
      }

      if (match.team1Score2 > match.team2Score2) {
        if (match.team1Score2 < 21) {
          return false;
        }

        // and the total for this rubber
        homeSets++;
      } else if (match.team2Score2 > match.team1Score2) {
        if (match.team2Score2 < 21) {
          return false;
        }

        // and the total for this rubber
        awaySets++;
      }

      if (homeSets === 2 || awaySets === 2) {
        return true;
      } else {
        if (match.team1Score3 > match.team2Score3) {
          return (match.team1Score3 >= 21);
        } else if (match.team2Score3 > match.team1Score3) {
          return (match.team2Score3 >= 21);
        }
      }

      return false;
    }

    // A valid match has 1 side winning 2 valid sets. If this is not the case return the
    // number of the set causing problems...otherwise return 0
    function validateMatchOutcome(team1Score1, team2Score1, team1Score2, team2Score2, team1Score3, team2Score3) {
      var team1Sets = 0;
      var team2Sets = 0;

      var firstSetValidation = validateSet(team1Score1, team2Score1);
      if (firstSetValidation !== 0) {
        return firstSetValidation;
      }

      if (team1Score1 > team2Score1) {
        team1Sets++;
      } else {
        team2Sets++;
      }

      var secondSetValidation = validateSet(team1Score2, team2Score2);
      if (secondSetValidation !== 0) {
        return secondSetValidation;
      }

      if (team1Score2 > team2Score2) {
        team1Sets++;
      } else {
        team2Sets++;
      }

      if (team1Sets === team2Sets) {
        var thirdSetValidation = validateSet(team1Score3, team2Score3);
        if (thirdSetValidation !== 0) {
          return thirdSetValidation;
        }
      } else {
        // if the match is already settled check if there are scores for the 3rd set
        if (team1Score3 !== 0 || team2Score3 !== 0) {
          return 7;
        }
      }

      return 0;

    }

    function validateSet(score1, score2) {
      if (isNaN(score1) || isNaN(score2)) {
        return 6;
      }

      // scores must be different
      if (score1 === score2) {
        return 5;
      }

      if (score1 > score2) {
        // score 1 is higher, must be no higher than 30
        if (score1 > 30) {
          return 1;
        }

        // but must be at least 21
        if (score1 < 21) {
          return 2;
        }

        // if score 1 is greater than 21, score 2 must be only 2 points behind
        if (score1 > 21) {
          if ((score1 - score2) > 2) {
            return 4;
          }
        }

        // if score 1 is not 30, then score2 must be at least 2 points less
        if (score1 < 30) {
          if ((score1 - score2) < 2) {
            return 3;
          }
        }
      } else {
        // score 2 is higher, must be no higher than 30
        if (score2 > 30) {
          return 1;
        }

        // but must be at least 21
        if (score2 < 21) {
          return 2;
        }

        // if score 2 is greater than 21, score 1 must be only 2 points behind
        if (score2 > 21) {
          if ((score2 - score1) > 2) {
            return 4;
          }
        }

        // if score 2 is not 30, then score1 must be at least 2 points less
        if (score2 < 30) {
          if ((score2 - score1) < 2) {
            return 3;
          }
        }
      }

      // valid set score
      return 0;
    }




    return {
      getMatchResult: getMatchResult,
      getShortMatchResult: getShortMatchResult,
      getPartnerName: getPartnerName,
      getPartnerNameWithLink: getPartnerNameWithLink,
      getPartnerID: getPartnerID,
      getPartnerGrade: getPartnerGrade,
      getOpponentName: getOpponentName,
      getOpponentNameWithLink: getOpponentNameWithLink,
      getOpponentID: getOpponentID,
      getOpponentGrade: getOpponentGrade,
      getMatchScore: getMatchScore,
      isMatchThreeSets: isMatchThreeSets,
      calculateMatchScores: calculateMatchScores,
      isRubberComplete: isRubberComplete,
      validateMatchOutcome: validateMatchOutcome
    };
  });
