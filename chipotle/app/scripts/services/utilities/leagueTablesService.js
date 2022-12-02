'use strict';

angular.module('NBAApp')
  .service('leagueTablesService', function(teamsService, leagueMatchesService) {

    var mensDoublesDivisions = [];
    var ladiesDoublesDivisions = [];
    var mixedDoublesDivisions = [];

    var mdDivisionList = [];
    var ldDivisionList = [];
    var mxDivisionList = [];

    function calculateLeagueTables() {
      var teams = teamsService.getTeams();
      var leagueMatches = leagueMatchesService.getLeagueMatches();

      var sortFunction = function(a, b) {
        if (a.division === 'Premier') {
          if (b.division === 'Premier') {
            return 0;
          } else {
            return -1;
          }
        }
        if (b.division === 'Premier') {
          return 1;
        }

        if (a.division < b.division) {
          return -1;
        } else if (b.division < a.division) {
          return 1;
        } else {
          return 0;
        }
      };

      teams.sort(sortFunction);

      createDivisions('Mens Doubles', teams, mensDoublesDivisions, mdDivisionList);
      createDivisions('Ladies Doubles', teams, ladiesDoublesDivisions, ldDivisionList);
      createDivisions('Mixed Doubles', teams, mixedDoublesDivisions, mxDivisionList);

      generateTables('Mens Doubles', mensDoublesDivisions, leagueMatches);
      generateTables('Ladies Doubles', ladiesDoublesDivisions, leagueMatches);
      generateTables('Mixed Doubles', mixedDoublesDivisions, leagueMatches);
    }

    function createDivisions(discipline, teams, divisions, divisionList) {

      var alreadyCreatedDivision = function(divisionName) {
        for (var i = 0 ; i < divisions.length ; i++) {
          if (divisions[i].divisionName === divisionName) {
            return divisions[i];
          }
        }
        return null;
      };

      for (var i = 0 ; i < teams.length ; i++) {
        if (teams[i].type === discipline) {
          var division = alreadyCreatedDivision(teams[i].division);
          if (division === null) {
            division = new Division(teams[i].division);
            divisions.push(division);

            divisionList.push(teams[i].division);
          }

          division.addTeam(new LeagueTableEntry(teams[i].id, teams[i].type, teams[i].teamName, teams[i].division));
        }
      }
    }

    function generateTables(discipline, divisions, leagueMatches) {
      var getHomeTeam = function(division, match) {
        for (var i = 0 ; i < division.teams.length ; i++) {
          if (match.homeTeam === division.teams[i].id) {
            return division.teams[i];
          }
        }
        return null;
      };
      var getAwayTeam = function(division, match) {
        for (var i = 0 ; i < division.teams.length ; i++) {
          if (match.awayTeam === division.teams[i].id) {
            return division.teams[i];
          }
        }
        return null;
      };
      var getDivision = function(division) {
        for (var i = 0 ; i < divisions.length ; i++) {
          if (divisions[i].divisionName === division) {
            return divisions[i];
          }
        }
        return null;
      };

      for (var i = 0 ; i < leagueMatches.length ; i++) {
        if (leagueMatches[i].matchType === discipline) {
          var division = getDivision(leagueMatches[i].division);
          var homeTeam = getHomeTeam(division, leagueMatches[i]);
          var awayTeam = getAwayTeam(division, leagueMatches[i]);

          homeTeam.updateTableObject(leagueMatches[i], true);
          awayTeam.updateTableObject(leagueMatches[i], false);
        }
      }
    }

    function Division(divisionName) {
      this.teams = [];
      this.divisionName = divisionName;

      this.addTeam = function(team) {
        this.teams.push(team);
      };
    }

    function LeagueTableEntry(id, type, teamName, division) {
      this.id = id;
      this.type = type;
      this.division = division;
      this.teamName = teamName;

      this.played = 0;
      this.won = 0;
      this.lost = 0;

      this.rubbersFor = 0;
      this.rubbersAgainst = 0;

      this.setsFor = 0;
      this.setsAgainst = 0;
      this.setsDiff = 0;

      this.pointsFor = 0;
      this.pointsAgainst = 0;
      this.pointsDiff = 0;

      this.leaguePoints = 0;

      this.updateTableObject = function(matchObject, homeTeam) {
        if (homeTeam) {
          this.played++;

          this.leaguePoints += parseInt(matchObject.homeTeamLeaguePoints);

          this.rubbersFor += parseInt(matchObject.homeTeamRubbers);
          this.rubbersAgainst += parseInt(matchObject.awayTeamRubbers);

          this.setsFor += parseInt(matchObject.homeTeamSets);
          this.setsAgainst += parseInt(matchObject.awayTeamSets);
          this.setsDiff = this.setsFor - this.setsAgainst;

          this.pointsFor += parseInt(matchObject.homeTeamPoints);
          this.pointsAgainst += parseInt(matchObject.awayTeamPoints);
          this.pointsDiff = this.pointsFor - this.pointsAgainst;

          if (matchObject.homeTeamRubbers > matchObject.awayTeamRubbers) {
            this.won++;
          } else if (matchObject.awayTeamRubbers > matchObject.homeTeamRubbers) {
            this.lost++;
          }
        } else {
          this.played++;

          this.leaguePoints += parseInt(matchObject.awayTeamLeaguePoints);

          this.rubbersFor += parseInt(matchObject.awayTeamRubbers);
          this.rubbersAgainst += parseInt(matchObject.homeTeamRubbers);

          this.setsFor += parseInt(matchObject.awayTeamSets);
          this.setsAgainst += parseInt(matchObject.homeTeamSets);
          this.setsDiff = this.setsFor - this.setsAgainst;

          this.pointsFor += parseInt(matchObject.awayTeamPoints);
          this.pointsAgainst += parseInt(matchObject.homeTeamPoints);
          this.pointsDiff = this.pointsFor - this.pointsAgainst;

          if (matchObject.awayTeamRubbers > matchObject.homeTeamRubbers) {
            this.won++;
          } else if (matchObject.homeTeamRubbers > matchObject.awayTeamRubbers) {
            this.lost++;
          }
        }
      };
    }

    function getMatchesForTeam(id) {
      return leagueMatchesService.getLeagueMatches().filter(function(match) {
        return (match.homeTeam === id || match.awayTeam === id && match.approved === 'yes');
      });
    }

    function divisionContainsTeam(division, team) {
      for (var i = 0 ; i < division.teams.length ; i++) {
        if (division.teams[i].id === team) {
          return division;
        }
      }
      return undefined;
    }

    function getDivisionForTeam(team) {
      var teamArray;
      switch (team.type) {
        case 'Mens Doubles':
          teamArray = mensDoublesDivisions;
          break;
        case 'Ladies Doubles':
          teamArray = ladiesDoublesDivisions;
          break;
        case 'Mixed Doubles':
          teamArray = mixedDoublesDivisions;
          break;
      }

      for (var i = 0 ; i < teamArray.length ; i++) {
        if (divisionContainsTeam(teamArray[i], team.id)) {
          return teamArray[i];
        }
      }

      return undefined;
    }

    return {
      getMensDoublesDivisions: function() { return mensDoublesDivisions; },
      getMensDoublesDivisionList: function() { return mdDivisionList; },
      getLadiesDoublesDivisions: function() { return ladiesDoublesDivisions; },
      getLadiesDoublesDivisionList: function() { return ldDivisionList; },
      getMixedDoublesDivisions: function() { return mixedDoublesDivisions; },
      getMixedDoublesDivisionList: function() { return mxDivisionList; },
      calculateLeagueTables: calculateLeagueTables,
      getMatchesForTeam: getMatchesForTeam,
      getDivisionForTeam: getDivisionForTeam
    };

  });
