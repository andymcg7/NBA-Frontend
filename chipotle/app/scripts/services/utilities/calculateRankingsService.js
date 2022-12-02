'use strict';

angular.module('NBAApp')
  .service('calculateRankingsService', function(playerService) {

    var allPlayers = [];
    var APlayers = [];
    var BPlayers = [];
    var CPlayers = [];
    var DPlayers = [];
    var EPlayers = [];

    var msPlayers = [];
    var lsPlayers = [];
    var mdPlayers = [];
    var ldPlayers = [];
    var mxdPlayers = [];
    var lxdPlayers = [];

    var rankingsCalculated = false;

    function filterPlayers(players, discipline, array) {
      var malePlayers = false;
      var matchesPlayed = 0;
      var playerGrade = '';

      // empty the arrays of players held before
      allPlayers = [];
      APlayers = [];
      BPlayers = [];
      CPlayers = [];
      DPlayers = [];
      EPlayers = [];

      if (discipline.indexOf('Mens') !== -1) {
        malePlayers = true;
      }

      var filterFunction = function(player) {
        if ((player.gender === 'Male' && malePlayers) || player.gender === 'Female' && !malePlayers) {
          if (discipline.indexOf('Singles') !== -1)
          {
            matchesPlayed = player.singlesMatchesPlayed;
            playerGrade = player.singlesGrade;
          }
          else if (discipline.indexOf('Mixed') !== -1)
          {
            matchesPlayed = player.mixedMatchesPlayed;
            playerGrade = player.mixedGrade;
          }
          else if (discipline.indexOf('Doubles') !== -1)
          {
            matchesPlayed = player.doublesMatchesPlayed;
            playerGrade = player.doublesGrade;
          }

          if (matchesPlayed !== '0') {
            if (array !== undefined && array.indexOf(player === -1)) {
              array.push(player);
            }
            switch(playerGrade.charAt(0)) {
              case 'A':
                APlayers.push(player);
                break;
              case 'B':
                BPlayers.push(player);
                break;
              case 'C':
                CPlayers.push(player);
                break;
              case 'D':
                DPlayers.push(player);
                break;
              case 'E':
                EPlayers.push(player);
                break;
              default:
                break;
            }
            return true;
          } else {
            return false;
          }
        }
      };

      allPlayers = players.filter(filterFunction);
    }

    function calculateRankingsForGrade(players, disciplinePrefix, suffix) {
        var storedAverage = -1;
        var counter = 1;
        var prevPlayer = null;

        players.sort(function(a, b) {
            return b[disciplinePrefix + 'Average'] - a[disciplinePrefix + 'Average'];
        });

        for (var i = 0 ; i < players.length ; i++) {
            var player = players[i];
            var playerAverage = player[disciplinePrefix + 'Average'];

            if (playerAverage === storedAverage)
            {
                if (prevPlayer[disciplinePrefix + 'Ranking' + suffix].indexOf('=') === -1)
                {
                    player[disciplinePrefix + 'Ranking' + suffix] = prevPlayer[disciplinePrefix + 'Ranking' + suffix] + '=';
                    prevPlayer[disciplinePrefix + 'Ranking' + suffix] += '=';
                }
                else
                {
                    player[disciplinePrefix + 'Ranking' + suffix] = prevPlayer[disciplinePrefix + 'Ranking' + suffix];
                }
            }
            else
            {
                player[disciplinePrefix + 'Ranking' + suffix] = counter.toString();
            }

            // record how many players there are within this grade category
            player[disciplinePrefix + 'RankingsTotal' + suffix] = players.length;

            counter++;
            prevPlayer = player;
            storedAverage = playerAverage;
        }
    }

    function calculateRankings(players, discipline, array) {

      // separate the players out into arrays based on grades
      filterPlayers(players, discipline, array);

      var disciplinePrefix = '';
      if (discipline.indexOf('Singles') !== -1)
      {
        disciplinePrefix = 'singles';
      }
      else if (discipline.indexOf('Mixed') !== -1)
      {
        disciplinePrefix = 'mixed';
      }
      else
      {
        disciplinePrefix = 'doubles';
      }

      calculateRankingsForGrade(allPlayers, disciplinePrefix, '');
      calculateRankingsForGrade(APlayers, disciplinePrefix, 'WithinGrade');
      calculateRankingsForGrade(BPlayers, disciplinePrefix, 'WithinGrade');
      calculateRankingsForGrade(CPlayers, disciplinePrefix, 'WithinGrade');
      calculateRankingsForGrade(DPlayers, disciplinePrefix, 'WithinGrade');
      calculateRankingsForGrade(EPlayers, disciplinePrefix, 'WithinGrade');
    }

    function calculateOverallRankingsAndStore() {
      if (!rankingsCalculated) {
        var players = playerService.returnAllPlayers();

        calculateRankings(players, 'Mens Singles', msPlayers);
        calculateRankings(players, 'Ladies Singles', lsPlayers);
        calculateRankings(players, 'Mens Doubles', mdPlayers);
        calculateRankings(players, 'Ladies Doubles', ldPlayers);
        calculateRankings(players, 'Mens Mixed Doubles', mxdPlayers);
        calculateRankings(players, 'Ladies Mixed Doubles', lxdPlayers);
      }

      rankingsCalculated = true;
    }

    function calculateOverallRankings() {
      var players = playerService.returnAllPlayers();

      calculateRankings(players, 'Mens Singles', undefined);
      calculateRankings(players, 'Ladies Singles', undefined);
      calculateRankings(players, 'Mens Doubles', undefined);
      calculateRankings(players, 'Ladies Doubles', undefined);
      calculateRankings(players, 'Mens Mixed Doubles', undefined);
      calculateRankings(players, 'Ladies Mixed Doubles', undefined);
    }

    function returnRankingPlayersForClub(club, discipline) {
      var filteredArray = [];
      var sourceArray = [];

      switch(discipline) {
        case 'Mens Singles':
          sourceArray = msPlayers;
          break;
        case 'Ladies Singles':
          sourceArray = lsPlayers;
          break;
        case 'Mens Doubles':
          sourceArray = mdPlayers;
          break;
        case 'Ladies Doubles':
          sourceArray = ldPlayers;
          break;
        case 'Mens Mixed Doubles':
          sourceArray = mxdPlayers;
          break;
        case 'Ladies Mixed Doubles':
          sourceArray = lxdPlayers;
          break;
      }

      for (var i = 0 ; i < sourceArray.length ; i++) {
        if (sourceArray[i].primaryClub === club) {
          filteredArray.push(sourceArray[i]);
        }
      }
      return filteredArray;
    }


    return {
      calculateOverallRankingsAndStore: calculateOverallRankingsAndStore,
      calculateOverallRankings: calculateOverallRankings,
      returnAllPlayers: function() {return allPlayers;},
      returnAPlayers: function() {return APlayers;},
      returnBPlayers: function() {return BPlayers;},
      returnCPlayers: function() {return CPlayers;},
      returnDPlayers: function() {return DPlayers;},
      returnEPlayers: function() {return EPlayers;},
      returnMSPlayers: function() {return msPlayers;},
      returnLSPlayers: function() {return lsPlayers;},
      returnMDPlayers: function() {return mdPlayers;},
      returnLDPlayers: function() {return ldPlayers;},
      returnMXDPlayers: function() {return mxdPlayers;},
      returnLXDPlayers: function() {return lxdPlayers;},
      getRankingPlayersForClub: returnRankingPlayersForClub
    };
});
