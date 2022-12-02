'use strict';

angular.module('NBAApp')
  .service('createPlayerTransferObjectService', function() {

    function createTransferObject(player, fullObject) {
      var postdata = {};

      postdata.name = player.name;
      postdata.gender = player.gender;
      postdata.affiliation = player.affiliation;
      postdata.primaryClub = player.primaryClub;
      postdata.secondaryClub = player.secondaryClub;
      postdata.singlesGrade = player.singlesGrade;
      postdata.doublesGrade = player.doublesGrade;
      postdata.mixedGrade = player.mixedGrade;

      postdata.singlesMatchesPlayed  = player.singlesMatchesPlayed;
      postdata.singlesCountingMatches = player.singlesCountingMatches;
      postdata.singlesAverage = player.singlesAverage;
      postdata.singlesTotalPoints = player.singlesTotalPoints;
      postdata.singlesBestPoints = player.singlesBestPoints;
      postdata.singlesDemotionAverage = player.singlesDemotionAverage;
      postdata.singlesGradeHistory = player.singlesGradeHistory;

      postdata.doublesMatchesPlayed  = player.doublesMatchesPlayed;
      postdata.doublesCountingMatches = player.doublesCountingMatches;
      postdata.doublesAverage = player.doublesAverage;
      postdata.doublesTotalPoints = player.doublesTotalPoints;
      postdata.doublesBestPoints = player.doublesBestPoints;
      postdata.doublesDemotionAverage = player.doublesDemotionAverage;
      postdata.doublesGradeHistory = player.doublesGradeHistory;

      postdata.mixedMatchesPlayed  = player.mixedMatchesPlayed;
      postdata.mixedCountingMatches = player.mixedCountingMatches;
      postdata.mixedAverage = player.mixedAverage;
      postdata.mixedTotalPoints = player.mixedTotalPoints;
      postdata.mixedBestPoints = player.mixedBestPoints;
      postdata.mixedDemotionAverage = player.mixedDemotionAverage;
      postdata.mixedGradeHistory = player.mixedGradeHistory;

      if (fullObject)
      {
        postdata.id = player.id;
      }

      return postdata;
    }

    return {
      createTransferObject: createTransferObject
    };
  });
