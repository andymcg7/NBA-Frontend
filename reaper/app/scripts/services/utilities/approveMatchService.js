'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:approveMatchService
 * @description
 * # clubsDataService
 * Simple service to alter the league match to indicate it is approved
 */

angular.module('NBAApp')
  .service('approveMatchService', function(matchesService, teamsService) {

    var approveMatch = function(leagueMatch) {
      leagueMatch.matchApproved = 'yes';

      leagueMatch.homeTeam = teamsService.getTeam(leagueMatch.homeTeam);
      leagueMatch.awayTeam = teamsService.getTeam(leagueMatch.awayTeam);

      leagueMatch.match1 = matchesService.getMatch(leagueMatch.match1);
      leagueMatch.match2 = matchesService.getMatch(leagueMatch.match2);
      leagueMatch.match3 = matchesService.getMatch(leagueMatch.match3);
      leagueMatch.match4 = matchesService.getMatch(leagueMatch.match4);
      leagueMatch.match5 = matchesService.getMatch(leagueMatch.match5);
      leagueMatch.match6 = matchesService.getMatch(leagueMatch.match6);
      leagueMatch.match7 = matchesService.getMatch(leagueMatch.match7);
      leagueMatch.match8 = matchesService.getMatch(leagueMatch.match8);
      leagueMatch.match9 = matchesService.getMatch(leagueMatch.match9);

      leagueMatch.match1.approved = true;
      leagueMatch.match2.approved = true;
      leagueMatch.match3.approved = true;
      leagueMatch.match4.approved = true;
      leagueMatch.match5.approved = true;
      leagueMatch.match6.approved = true;
      leagueMatch.match7.approved = true;
      leagueMatch.match8.approved = true;
      leagueMatch.match9.approved = true;
    };

    return {
      approveMatch: approveMatch
    };

  });
