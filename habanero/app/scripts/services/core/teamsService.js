'use strict';

angular.module('NBAApp')
  .service('teamsService', function() {

    var teams = [];
    var teamsLookup = {};

    function setTeams(newTeams) {
      teams = newTeams;
      buildTeamsLookup();
    }

    function buildTeamsLookup() {
      teamsLookup = teams.reduce(function(map, obj) {
        map[obj.id] = obj.teamName;
        return map;
      }, {});
    }

    function getTeamName(id) {
      return teamsLookup[id];
    }

    function getTeamAbbreviation(id) {
      for (var i = 0 ; i < teams.length ; i++) {
        if (teams[i].id === id) {
          return teams[i].abbreviation;
        }
      }
    }

    function getTeam(id) {
      for (var i = 0 ; i < teams.length ; i++) {
        if (teams[i].id === id) {
          return teams[i];
        }
      }
      return undefined;
    }


    return {
      setTeams: setTeams,
      getTeams: function() { return teams; },
      getTeamName: getTeamName,
      getTeamAbbreviation: getTeamAbbreviation,
      getTeam: getTeam
    };
  });
