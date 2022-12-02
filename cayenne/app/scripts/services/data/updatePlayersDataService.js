'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:updatePlayersDataService
 * @description
 * # updatePlayersDataService
 */

angular.module('NBAApp')
  .service('updatePlayersDataService', function($http, $httpParamSerializerJQLike) {

    var updatePlayers = function(url, players) {
      var sendObj = JSON.stringify(players);

      return $http({
        method: 'POST',
        url: url,
        data: $httpParamSerializerJQLike({
          'updatePlayers': 'true',
          'sendData': sendObj
        }),
        headers: {
          "Content-Type": 'application/x-www-form-urlencoded'
        }
      });
    };


    return {
      updatePlayers: updatePlayers
    };

  });
