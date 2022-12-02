'use strict';

/**
 * @ngdoc function
 * @name NBAApp.service:clubsDataService
 * @description
 * # clubsDataService
 * Simple service to fetch teams from the db
 */

angular.module('NBAApp')
  .service('disputeMatchDataService', function($http, $httpParamSerializerJQLike) {

    var disputeMatch = function(url, subject, email, text, matchID) {

      var postdata = {};
      postdata.subject = subject;
      postdata.email = email;
      postdata.text = text;
      postdata.matchID = matchID;
      postdata.disputeLeagueMatch = 'true';

      var dataString = JSON.stringify(postdata);

      return $http({
        method: 'POST',
        url: url,
        data: $httpParamSerializerJQLike({
          'disputeLeagueMatch': true,
          'sendData': dataString
        }),
        headers: {
          "Content-Type": 'application/x-www-form-urlencoded'
        }
      });
    };

    return {
      disputeMatch: disputeMatch
    };

  });
