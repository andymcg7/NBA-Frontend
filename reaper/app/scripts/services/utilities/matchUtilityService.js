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
      isMatchThreeSets: isMatchThreeSets
    };
  });
