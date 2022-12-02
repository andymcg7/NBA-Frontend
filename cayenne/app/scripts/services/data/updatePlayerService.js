'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:updatePlayerService
 * @description
 * # updatePlayerService
 * Service to update a player in the database
 */

angular.module('NBAApp')
  .service('updatePlayerService', function($http, $httpParamSerializerJQLike) {

    var updatePlayer = function(url, player) {

      return $http({
        method: 'POST',
        url: url,
        data: $httpParamSerializerJQLike({
          'updatePlayer': true,
          'sendData': player
        }),
        headers: {
          "Content-Type": 'application/x-www-form-urlencoded'
        }
      });
    };

    return {
      updatePlayer: updatePlayer
    };

  });
