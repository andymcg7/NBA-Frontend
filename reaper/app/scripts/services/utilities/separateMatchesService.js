'use strict';

angular.module('NBAApp')
  .service('separateMatchesService', function() {

    var singlesMatches = [];
    var doublesMatches = [];
    var mixedMatches = [];

    function separateMatches(matches) {
      singlesMatches = [];
      doublesMatches = [];
      mixedMatches = [];

      var singlesCheck = function(match) {
        return match.discipline.indexOf('Singles') !== -1;
      };
      var mixedCheck = function(match) {
        return match.discipline.indexOf('Mixed') !== -1;
      };
      var doublesCheck = function(match) {
        return (match.discipline.indexOf('Mens Doubles') !== -1 || match.discipline.indexOf('Ladies Doubles') !== -1);
      };

      singlesMatches = matches.filter(singlesCheck);
      mixedMatches = matches.filter(mixedCheck);
      doublesMatches = matches.filter(doublesCheck);
    }

    return {
            separateMatches: separateMatches,
            getSinglesMatches: function () { return singlesMatches; },
            getDoublesMatches: function () { return doublesMatches; },
            getMixedMatches: function () { return mixedMatches; }
    };
});
