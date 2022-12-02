'use strict';

angular.module('NBAApp')
  .service('createLeagueMatchTransferObjectService', function() {

    function createTransferObject(leagueMatch) {
      var postdata = {};

      postdata.submittedBy = leagueMatch.email;

      postdata.matchType = leagueMatch.matchDiscipline;
      postdata.division = leagueMatch.division.divisionName;
      postdata.creationTime = new Date().getTime();
      postdata.matchDate = leagueMatch.matchDate.getTime();
      postdata.homeTeam = leagueMatch.homeTeam.id;
      postdata.homeTeamName = leagueMatch.homeTeam.teamName;

      //if (leagueMatch.homeTeam.clubObject != null) {
      //  postdata['homeTeamClubName'] = leagueMatch.homeTeam.clubObject.name;
      //}

      postdata.awayTeam = leagueMatch.awayTeam.id;
      postdata.awayTeamName = leagueMatch.awayTeam.teamName;
      postdata.venue = leagueMatch.venue;
      postdata.comments = leagueMatch.comments;
      postdata.dateString = formattedDate(leagueMatch.matchDate);

      postdata.homePair1Player1 = getPlayerID(leagueMatch.homePair1Player1);
      postdata.homePair1Player2 = getPlayerID(leagueMatch.homePair1Player2);
      postdata.homePair2Player1 = getPlayerID(leagueMatch.homePair2Player1);
      postdata.homePair2Player2 = getPlayerID(leagueMatch.homePair2Player2);
      postdata.homePair3Player1 = getPlayerID(leagueMatch.homePair3Player1);
      postdata.homePair3Player2 = getPlayerID(leagueMatch.homePair3Player2);

      postdata.awayPair1Player1 = getPlayerID(leagueMatch.awayPair1Player1);
      postdata.awayPair1Player2 = getPlayerID(leagueMatch.awayPair1Player2);
      postdata.awayPair2Player1 = getPlayerID(leagueMatch.awayPair2Player1);
      postdata.awayPair2Player2 = getPlayerID(leagueMatch.awayPair2Player2);
      postdata.awayPair3Player1 = getPlayerID(leagueMatch.awayPair3Player1);
      postdata.awayPair3Player2 = getPlayerID(leagueMatch.awayPair3Player2);

      postdata.homeTeamLeaguePoints = leagueMatch.homeTeamLeaguePoints;
      postdata.homeTeamRubbers = leagueMatch.homeTeamRubbers;
      postdata.homeTeamSets = leagueMatch.homeTeamSets;
      postdata.homeTeamPoints = leagueMatch.homeTeamPoints;

      postdata.awayTeamLeaguePoints = leagueMatch.awayTeamLeaguePoints;
      postdata.awayTeamRubbers = leagueMatch.awayTeamRubbers;
      postdata.awayTeamSets = leagueMatch.awayTeamSets;
      postdata.awayTeamPoints = leagueMatch.awayTeamPoints;

      postdata.approved = leagueMatch.matchApproved === 'yes' ? 'yes' : 'no';

      postdata.createLeagueMatch = 'true';

      var returnObj = {};
      returnObj.sendData = postdata;

      returnObj.match1 = getTransferObjectForRubber(leagueMatch.match1, getPlayerID(leagueMatch.homePair1Player1), getPlayerID(leagueMatch.homePair1Player2), getPlayerID(leagueMatch.awayPair1Player1), getPlayerID(leagueMatch.awayPair1Player2), postdata.matchDate);
      returnObj.match2 = getTransferObjectForRubber(leagueMatch.match2, getPlayerID(leagueMatch.homePair2Player1), getPlayerID(leagueMatch.homePair2Player2), getPlayerID(leagueMatch.awayPair2Player1), getPlayerID(leagueMatch.awayPair2Player2), postdata.matchDate);
      returnObj.match3 = getTransferObjectForRubber(leagueMatch.match3, getPlayerID(leagueMatch.homePair3Player1), getPlayerID(leagueMatch.homePair3Player2), getPlayerID(leagueMatch.awayPair3Player1), getPlayerID(leagueMatch.awayPair3Player2), postdata.matchDate);
      returnObj.match4 = getTransferObjectForRubber(leagueMatch.match4, getPlayerID(leagueMatch.homePair2Player1), getPlayerID(leagueMatch.homePair2Player2), getPlayerID(leagueMatch.awayPair1Player1), getPlayerID(leagueMatch.awayPair1Player2), postdata.matchDate);
      returnObj.match5 = getTransferObjectForRubber(leagueMatch.match5, getPlayerID(leagueMatch.homePair3Player1), getPlayerID(leagueMatch.homePair3Player2), getPlayerID(leagueMatch.awayPair2Player1), getPlayerID(leagueMatch.awayPair2Player2), postdata.matchDate);
      returnObj.match6 = getTransferObjectForRubber(leagueMatch.match6, getPlayerID(leagueMatch.homePair1Player1), getPlayerID(leagueMatch.homePair1Player2), getPlayerID(leagueMatch.awayPair3Player1), getPlayerID(leagueMatch.awayPair3Player2), postdata.matchDate);
      returnObj.match7 = getTransferObjectForRubber(leagueMatch.match7, getPlayerID(leagueMatch.homePair3Player1), getPlayerID(leagueMatch.homePair3Player2), getPlayerID(leagueMatch.awayPair1Player1), getPlayerID(leagueMatch.awayPair1Player2), postdata.matchDate);
      returnObj.match8 = getTransferObjectForRubber(leagueMatch.match8, getPlayerID(leagueMatch.homePair1Player1), getPlayerID(leagueMatch.homePair1Player2), getPlayerID(leagueMatch.awayPair2Player1), getPlayerID(leagueMatch.awayPair2Player2), postdata.matchDate);
      returnObj.match9 = getTransferObjectForRubber(leagueMatch.match9, getPlayerID(leagueMatch.homePair2Player1), getPlayerID(leagueMatch.homePair2Player2), getPlayerID(leagueMatch.awayPair3Player1), getPlayerID(leagueMatch.awayPair3Player2), postdata.matchDate);

      return returnObj;
    }

    function getPlayerID(player) {
      if (player === undefined || player === null) {
        return -1;
      } else {
        return player.id;
      }
    }

    function getTransferObjectForRubber(rubber, pair1Player1, pair1Player2, pair2Player1, pair2Player2, date) {
      var match = angular.copy(rubber);
      if (!match.hasOwnProperty('team1Score3')) {
        match.team1Score3 = 0;
      }
      if (!match.hasOwnProperty('team2Score3')) {
        match.team2Score3 = 0;
      }
      match.player1 = pair1Player1;
      match.partner1 = pair1Player2;
      match.player2 = pair2Player1;
      match.partner2 = pair2Player2;
      match.player1Grade = '';
      match.partner1Grade = '';
      match.player2Grade = '';
      match.partner2Grade = '';
      match.date = date;

      if (!match.hasOwnProperty('matchPlayed')) {
        match.matchPlayed = 'true';
      } else {
        match.matchPlayed = rubber.matchPlayed.toString();
      }

      return match;
    }

    function formattedDate(date) {
      var d = new Date(date || Date.now()),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) {
        month = '0' + month;
      }
      if (day.length < 2) {
        day = '0' + day;
      }

      return [day, month, year].join('/');
    }


    return {
      createTransferObject: createTransferObject
    };
  });
