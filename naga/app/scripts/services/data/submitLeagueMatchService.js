'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:submitLeagueMatchService
 * @description
 * # submitLeagueMatchService
 * Service to submit a league match
 */

angular.module('NBAApp')
  .service('submitLeagueMatchService', function($http, $httpParamSerializerJQLike, createLeagueMatchTransferObjectService) {

    var submitLeagueMatch = function(url, leagueMatch) {
      var transferObj = createLeagueMatchTransferObjectService.createTransferObject(leagueMatch);
      var sendObj = JSON.stringify(transferObj.sendData);
      var match1 = JSON.stringify(transferObj.match1);
      var match2 = JSON.stringify(transferObj.match2);
      var match3 = JSON.stringify(transferObj.match3);
      var match4 = JSON.stringify(transferObj.match4);
      var match5 = JSON.stringify(transferObj.match5);
      var match6 = JSON.stringify(transferObj.match6);
      var match7 = JSON.stringify(transferObj.match7);
      var match8 = JSON.stringify(transferObj.match8);
      var match9 = JSON.stringify(transferObj.match9);

      return $http({
        method: 'POST',
        url: url,
        data: $httpParamSerializerJQLike({
          'createLeagueMatch': true,
          'sendData': sendObj,
          'match1': match1,
          'match2': match2,
          'match3': match3,
          'match4': match4,
          'match5': match5,
          'match6': match6,
          'match7': match7,
          'match8': match8,
          'match9': match9
        }),
        headers: {
          "Content-Type": 'application/x-www-form-urlencoded'
        }
      });

      // return $http.post(url, {params:{'createLeagueMatch': true, 'sendData': sendObj, 'match1': match1, 'match2': match2, 'match3': match3, 'match4': match4, 'match5': match5, 'match6': match6, 'match7': match7, 'match8': match8, 'match9': match9}});
    };

    return {
      submitLeagueMatch: submitLeagueMatch
    };

  });
