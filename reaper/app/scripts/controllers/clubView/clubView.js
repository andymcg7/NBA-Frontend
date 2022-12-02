'use strict';

/**
 * @ngdoc function
 * @name NBAApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the NBAApp
 */
angular.module('NBAApp')
  .controller('ClubViewCtrl', function ($scope, $routeParams, $filter, $location, $q, $window, dataService, playerService,
                                        calculateRankingsService, teamsService, leagueTablesService, clubsService) {

    $scope.search = '';
    $scope.selected = [];
    $scope.loadingData = true;
    $scope.tiles = [];
    $scope.googleMapsUrl = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCdi3sb-qV6j6GJbfFs3lgu7jcRExCziaQ';

    var clubToShow = 0;

    function generateRankingsTile(players, title, option) {
      var tile = {};
      tile.title = title;
      tile.rankings = true;
      tile.leagueTable = false;
      tile.recentMatches = false;

      tile.option = option;

      tile.span  = { row : 9, col : 1 };
      //var rows = Math.max(7, players.length);
      //tile.span  = { row : rows, col : 1 };
      //tile.club = clubToShow;

      var averageField;
      switch (option) {
        case 'ms':
          averageField = 'singlesAverage';
          tile.background = 'darkBlue';
          tile.viewTab = 'singles';
              break;
        case 'ls':
          averageField = 'singlesAverage';
          tile.background = 'blue';
          tile.viewTab = 'singles';
              break;
        case 'md':
          averageField = 'doublesAverage';
          tile.background = 'deepBlue';
          tile.viewTab = 'doubles';
              break;
        case 'ld':
          averageField = 'doublesAverage';
          tile.background = 'green';
          tile.viewTab = 'doubles';
              break;
        case 'mxd':
          averageField = 'mixedAverage';
          tile.background = 'yellow';
          tile.viewTab = 'mixed';
              break;
        case 'lxd':
          tile.background = 'lightPurple';
          averageField = 'mixedAverage';
          tile.viewTab = 'mixed';
              break;
      }

      players.sort(function(a, b){
        if (Number(a[averageField]) < Number(b[averageField])) {
          return 1;
        } else if (Number(a[averageField]) > Number(b[averageField])) {
          return -1;
        } else {
          return 0;
        }
      });

      tile.data = players.slice(0, 8);

      return tile;
    }

    function generateLeagueTableTile(division, type) {
      var tile = {};
      tile.rankings = false;
      tile.leagueTable = true;
      tile.recentMatches = false;
      tile.background = 'yellow';

      switch(type) {
        case 'Mens Doubles':
          tile.background = 'deepBlue';
          tile.short = 'md';
          break;
        case 'Ladies Doubles':
          tile.background = 'green';
          tile.short = 'ld';
          break;
        case 'Mixed Doubles':
          tile.background = 'yellow';
          tile.short = 'mx';
          break;
      }

      tile.division = division;
      tile.title = type + ' ' + division.divisionName + ' Division';
      tile.span  = { row : 9, col : 1 };

      tile.division.teams.sort(function (a, b) {

          // if any team has won all of their matches they must finish top
          if (a.won === (tile.division.teams.length - 1) * 2) {
            return -1;
          }

          if (a.leaguePoints < b.leaguePoints) {
            return 1;
          }
          if (a.leaguePoints > b.leaguePoints) {
            return -1;
          }
          if (a.won < b.won) {
            return 1;
          }
          if (a.won < b.won) {
            return -1;
          }
          if (a.rubbersFor < b.rubbersFor) {
            return 1;
          }
          if (a.rubbersFor < b.rubbersFor) {
            return -1;
          }
          if ((a.setsFor - a.setsAgainst) < (b.setsFor - b.setsAgainst)) {
            return 1;
          }
          if ((a.setsFor - a.setsAgainst) > (b.setsFor - b.setsAgainst)) {
            return -1;
          }
          if ((a.pointsFor - a.pointsAgainst) < (b.pointsFor - b.pointsAgainst)) {
            return 1;
          }
          if ((a.pointsFor - a.pointsAgainst) > (b.pointsFor - b.pointsAgainst)) {
            return -1;
          }
          // a must be equal to b
          return 0;
        });

      return tile;
    }

    function generateRecentMatchesTile(matches) {
      var tile = {};
      tile.rankings = false;
      tile.leagueTable = false;
      tile.recentMatches = true;
      tile.background = 'red';

      tile.matches = matches;
      tile.title = 'Recent Matches';
      tile.span  = { row : 9, col : 1 };

      return tile;
    }

    function generateMapTile(club) {
      var tile = {};
      tile.title = 'Venue';
      tile.background = 'gray';
      tile.map = true;
      tile.clubName = club.name;
      tile.venue = club.venue;
      tile.address = club.venueAddress;
      tile.lat = club.lat;
      tile.lng = club.lng;
      tile.span  = { row : 9, col : 1 };

      return tile;
    }

    $scope.tiles = [];

    function setupView() {
      $scope.noClubNumber = false;

      $scope.noConnection = false;
      $scope.dataSuccess = true;
      $scope.loadingData = false;

      var tiles = [];

      var club = clubsService.getClub(clubToShow);
      if (club) {
        $scope.clubName = club.name;
      }

      var clubTeams = teamsService.getTeamsForClub(clubToShow);

      // now get all of the matches played by all of the league teams and push them into a single array
      // We'll then sort that array by the date played and remove all but the most recent 3 matches to display
      var matchArray = [];
      for (var i = 0; i < clubTeams.length; i++) {
        matchArray = matchArray.concat(leagueTablesService.getMatchesForTeam(clubTeams[i].id));
      }
      matchArray.sort(function (a, b) {
        if (Number(a.matchDate) < Number(b.matchDate)) {
          return 1;
        } else if (Number(a.matchDate) > Number(b.matchDate)) {
          return -1;
        } else {
          return 0;
        }
      });

      var msPlayers = calculateRankingsService.getRankingPlayersForClub(clubToShow, 'Mens Singles');
      if (msPlayers.length > 0) {
        tiles.push(generateRankingsTile(msPlayers, 'Mens Singles Top Players', 'ms'));
      }
      var lsPlayers = calculateRankingsService.getRankingPlayersForClub(clubToShow, 'Ladies Singles');
      if (lsPlayers.length > 0) {
        tiles.push(generateRankingsTile(lsPlayers, 'Ladies Singles Top Players', 'ls'));
      }
      var mdPlayers = calculateRankingsService.getRankingPlayersForClub(clubToShow, 'Mens Doubles');
      if (mdPlayers.length > 0) {
        tiles.push(generateRankingsTile(mdPlayers, 'Mens Doubles Top Players', 'md'));
      }
      var ldPlayers = calculateRankingsService.getRankingPlayersForClub(clubToShow, 'Ladies Doubles');
      if (ldPlayers.length > 0) {
        tiles.push(generateRankingsTile(ldPlayers, 'Ladies Doubles Top Players', 'ld'));
      }
      var mxdPlayers = calculateRankingsService.getRankingPlayersForClub(clubToShow, 'Mens Mixed Doubles');
      if (mxdPlayers.length > 0) {
        tiles.push(generateRankingsTile(mxdPlayers, 'Mens Mixed Doubles Top Players', 'mxd'));
      }
      var lxdPlayers = calculateRankingsService.getRankingPlayersForClub(clubToShow, 'Ladies Mixed Doubles');
      if (lxdPlayers.length > 0) {
        tiles.push(generateRankingsTile(lxdPlayers, 'Ladies Mixed Doubles Top Players', 'lxd'));
      }


      var divisionsStored = [];
      for (i = 0; i < clubTeams.length; i++) {
        // Now get the division for this team
        var division = leagueTablesService.getDivisionForTeam(clubTeams[i]);
        if (division && !isDivisionAlreadyPresent(divisionsStored, division)) {
          divisionsStored.push(division);
          tiles.push(generateLeagueTableTile(division, clubTeams[i].type));
        }
      }

      // randomise the array
      $scope.tiles = shuffle(tiles);

      if (matchArray.length > 0) {
        matchArray = matchArray.slice(0, 3);
        $scope.tiles.unshift(generateRecentMatchesTile(matchArray));
      }

      $scope.tiles.unshift(generateMapTile(club));

      setTimeout(function() {
        $scope.$apply(function() {
          $scope.tilesReady = true;
        });
      }, 50);
    }

    function init() {
      if (dataService.isInitialised()) {
        if (!$routeParams.hasOwnProperty('param')) {
          $scope.clubs = clubsService.getSortedClubDisplayList();
          $scope.noClubNumber = true;
          $scope.loadingData = false;
        } else {
          clubToShow = $routeParams.param;
          setupView();
        }
      } else {
        $scope.loadingPromise = dataService.initialise()
          .then(function() {

            if (!$routeParams.hasOwnProperty('param')) {
              $scope.clubs = clubsService.getSortedClubDisplayList();
              $scope.noClubNumber = true;
              $scope.loadingData = false;
            } else {
              clubToShow = $routeParams.param;
              setupView();
            }
          }, function() {
              $scope.noConnection = true;
              $scope.dataSuccess = false;
              $scope.loadingData = false;
          });
        }
      }

  function isDivisionAlreadyPresent(array, division) {
    for (var i = 0 ; i < array.length ; i++) {
      if (array[i] === division) {
        return true;
      }
    }
    return false;
  }

    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    $scope.formatMatchDate = function (date) {
      var returnDate = new Date(parseInt(date));
      return returnDate.getDate() + '/' + (returnDate.getMonth() + 1) + '/' + returnDate.getFullYear();
    };

    $scope.orderByFunction = function(player) {
      var key = $scope.sortKey;

      if ($scope.sortKey === 'rank') {
        key = $scope.rankingField;
      } else if ($scope.sortKey === 'average') {
        key = $scope.averageField;
      } else if ($scope.sortKey === 'matchesPlayed') {
        key = $scope.matchesPlayedField;
      } else if ($scope.sortKey === 'grade') {
        key = $scope.gradeField;
      }

      if (!isNaN(player[key])) {
        return Number(player[key]);
      } else {
        var string = player[key];
        if (string === undefined) {
          return undefined;
        } else if (string.indexOf('=') !== -1) {
          return parseFloat(string);
        } else {
          return string;
        }
      }
    };

    $scope.getRanking = function(tile, player) {
      switch(tile.option) {
        case 'ms':
        case 'ls':
          return player.singlesRanking;
        case 'md':
        case 'ld':
          return player.doublesRanking;
        case 'mxd':
        case 'lxd':
          return player.mixedRanking;
      }
    };

    $scope.getGrade = function(tile, player) {
      switch(tile.option) {
        case 'ms':
        case 'ls':
          return player.singlesGrade;
        case 'md':
        case 'ld':
          return player.doublesGrade;
        case 'mxd':
        case 'lxd':
          return player.mixedGrade;
      }
    };

    $scope.getMatchesPlayed = function(tile, player) {
      switch(tile.option) {
        case 'ms':
        case 'ls':
          return player.singlesMatchesPlayed;
        case 'md':
        case 'ld':
          return player.doublesMatchesPlayed;
        case 'mxd':
        case 'lxd':
          return player.mixedMatchesPlayed;
      }
    };

    $scope.getAverage = function(tile, player) {
      switch(tile.option) {
        case 'ms':
        case 'ls':
          return Number(player.singlesAverage);
        case 'md':
        case 'ld':
          return Number(player.doublesAverage);
        case 'mxd':
        case 'lxd':
          return Number(player.mixedAverage);
      }
    };

    $scope.getTeamName = teamsService.getTeamName;

    $scope.clubClose = function() {
      clubToShow = $scope.selectedClub.id;
      $location.path( '/' + clubToShow );
      setupView();
    };

    $scope.tileClick = function(tile) {
      if (tile.leagueTable || tile.recentMatches) {
        $window.open('http://northumberlandbadminton.org/leagues/tables/#/' + tile.short + '?division=' + tile.division.divisionName);
      }
    };

    $scope.leagueMatchClick = function(match) {
      $window.open('http://northumberlandbadminton.org/leagues/tables/#/leagueMatch/' + match.id);
    };

    init();


  });

