'use strict';

angular.module('NBAApp')
  .service('clubsService', function() {

    var clubs = [];
    var clubsDisplayArray = [];
    var clubsLookup = {};

    function setClubs(newClubs) {
      clubs = newClubs;
      buildClubsLookup();
      buildClubsDisplayArray();
    }

    function buildClubsLookup() {
      clubsLookup = clubs.reduce(function(map, obj) {
        map[obj.id] = obj.name;
        return map;
      }, {});
    }

    function buildClubsDisplayArray() {
      clubsDisplayArray = clubs.map(function(obj) {
        return {id: obj.id, name: obj.name};
      });
      clubsDisplayArray.sort(function(a, b){
        if (a.name < b.name) {
          return -1;
        } else if (a.name > b.name) {
          return 1;
        } else {
          return 0;
        }
      });
      clubsDisplayArray.unshift({id: 'all', name: 'All'});
    }

    function getClubDisplay(player) {
      if (player !== undefined) {
        if (player.primaryClub === player.secondaryClub && player.primaryClub !== '0') {
          return getClubName(player.primaryClub);
        } else if (player.primaryClub === '0') {
          return 'No club';
        } else {
          return getClubName(player.primaryClub) + ' / ' + getClubName(player.secondaryClub);
        }
      } else {
        return '';
      }
    }

    function getClubName(id) {
      return clubsLookup[id];
    }

    function getClubsDisplayList() {
      return clubsDisplayArray;
    }

    function getClub(id) {
      for (var i = 0 ; i < clubs.length ; i++) {
        if (clubs[i].id === id) {
          return clubs[i];
        }
      }
      return undefined;
    }


    return {
      setClubs: setClubs,
      getClubDisplay: getClubDisplay,
      getSortedClubDisplayList: getClubsDisplayList,
      getClub: getClub
    };
  });
