'use strict';

angular.module('NBAApp')
  .service('divisionsService', function(teamsService) {

    var mensDoublesDivisions = [];
    var ladiesDoublesDivisions = [];
    var mixedDoublesDivisions = [];

    var mdDivisionList = [];
    var ldDivisionList = [];
    var mxDivisionList = [];

    function calculateDivisions() {
      var teams = teamsService.getTeams();

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

          division.addTeam(new LeagueTableEntry(teams[i].id, teams[i].type, teams[i].teamName, teams[i].division, teams[i].clubID));
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

    function LeagueTableEntry(id, type, teamName, division, clubID) {
      this.id = id;
      this.type = type;
      this.division = division;
      this.teamName = teamName;
      this.clubID = clubID;
    }


    return {
      getMensDoublesDivisions: function() { return mensDoublesDivisions; },
      getMensDoublesDivisionList: function() { return mdDivisionList; },
      getLadiesDoublesDivisions: function() { return ladiesDoublesDivisions; },
      getLadiesDoublesDivisionList: function() { return ldDivisionList; },
      getMixedDoublesDivisions: function() { return mixedDoublesDivisions; },
      getMixedDoublesDivisionList: function() { return mxDivisionList; },
      calculateDivisions: calculateDivisions
    };

  });
