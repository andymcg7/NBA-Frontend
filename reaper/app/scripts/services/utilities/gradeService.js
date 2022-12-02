'use strict';

angular.module('NBAApp')
  .service('gradeService', function(playerService) {
    var gradePoints = [{grade:'A2', points:1024},
      {grade:'B1', points:512},
      {grade:'B2', points:256},
      {grade:'C1', points:128},
      {grade:'C2', points:64},
      {grade:'D1', points:32},
      {grade:'D2', points:16},
      {grade:'E1', points:8},
      {grade:'E2', points:4},
      {grade:'UG', points:2 } ];

    function getCompositeGradeValue(grade1, grade2)
    {
      var grade1Index = -1;
      var grade2Index = -1;

      // find the index of each grade
      for (var i = 0 ; i < gradePoints.length ; i++)
      {
        if (gradePoints[i].grade === grade1)
        {
          grade1Index = i;
        }
        if (gradePoints[i].grade === grade2)
        {
          grade2Index = i;
        }
      }

      if (grade1Index === -1 || grade2Index === -1) {
        return -1;
      }

      var difference = grade2Index - grade1Index;

      // if the difference is odd, we need to find the grade in the middle

      if (difference === 0)  // both grades the same, return the value
      {
        return getGradePointsValue(grade1);
      }
      else if ((difference % 2) === 0)
      {
        var factor = difference / 2;
        var middle = grade1Index + factor;

        return gradePoints[middle].points;
      }
      else
      {
        var grade1Score;
        var grade2Score;

        if (difference === 1 || difference === -1)
        {
          grade1Score = getGradePointsValue(grade1);
          grade2Score = getGradePointsValue(grade2);

          return (grade1Score + grade2Score) / 2;
        }
        else
        {
          var oddFactor = difference / 2;
          var middle1 = grade1Index + oddFactor - 0.01;
          var middle2 = grade2Index - oddFactor - 0.01;

          middle1 = Math.round(middle1);
          middle2 = Math.round(middle2);

          grade1Score = gradePoints[middle1].points;
          grade2Score = gradePoints[middle2].points;

          return (grade1Score + grade2Score) / 2;
        }
      }
    }

    function getGradePromotionValue(grade) {
      for (var i = 0 ; i < gradePoints.length ; i++)
      {
        if (gradePoints[i].grade === grade)
        {
          if (i === 0)
          {
            return 'n/a';
          }
          else
          {
            var points = gradePoints[i - 1].points;

            return (points / 4);
          }
        }
      }

      return 'n/a';
    }

    function getGradeDemotionValue(grade) {
      for (var i = 0 ; i < gradePoints.length ; i++)
      {
        if (gradePoints[i].grade === grade)
        {
          if ((i === (gradePoints.length - 1)) || (i === (gradePoints.length - 2)))
          {
            return -1;
          }
          else
          {
            var points = gradePoints[i + 1].points;
            var returnPoints = points / 2;
            return returnPoints;
          }
        }
      }

      return -1;
    }

    function getGradePointsValue(grade) {
      // we have a composite grade if this is the case
      if (grade.indexOf('/') !== -1)
      {
        var grade1 = grade.substring(0, grade.indexOf('/'));
        var grade2 = grade.substring(grade.indexOf('/') + 1, grade.length);

        return getCompositeGradeValue(grade1, grade2);
      }
      for (var i = 0 ; i < gradePoints.length ; i++)
      {
        if (gradePoints[i].grade === grade)
        {
          return gradePoints[i].points;
        }
      }
      return -1;
    }

    function getTeamGradeArray(leagueMatch, home) {
      var playerGradeArray = [];
      var playerArray = [];

      var disciplineGrade = "doublesGrade";
      if (leagueMatch.matchDiscipline.indexOf("Mixed") != -1) {
        disciplineGrade = "mixedGrade";
      }

      if (home) {
        if (leagueMatch.homePair1Player1) {
          playerArray.push(leagueMatch.homePair1Player1);
        }
        if (leagueMatch.homePair1Player2) {
          playerArray.push(leagueMatch.homePair1Player2);
        }
        if (leagueMatch.homePair2Player1) {
          playerArray.push(leagueMatch.homePair2Player1);
        }
        if (leagueMatch.homePair2Player2) {
          playerArray.push(leagueMatch.homePair2Player2);
        }
        if (leagueMatch.homePair3Player1) {
          playerArray.push(leagueMatch.homePair3Player1);
        }
        if (leagueMatch.homePair3Player2) {
          playerArray.push(leagueMatch.homePair3Player2);
        }
      } else {
        if (leagueMatch.awayPair1Player1) {
          playerArray.push(leagueMatch.awayPair1Player1);
        }
        if (leagueMatch.awayPair1Player2) {
          playerArray.push(leagueMatch.awayPair1Player2);
        }
        if (leagueMatch.awayPair2Player1) {
          playerArray.push(leagueMatch.awayPair2Player1);
        }
        if (leagueMatch.awayPair2Player2) {
          playerArray.push(leagueMatch.awayPair2Player2);
        }
        if (leagueMatch.awayPair3Player1) {
          playerArray.push(leagueMatch.awayPair3Player1);
        }
        if (leagueMatch.awayPair3Player2) {
          playerArray.push(leagueMatch.awayPair3Player2);
        }
      }

      for (var i = 0 ; i < playerArray.length ; i++) {
        if (playerArray[i][disciplineGrade] !== 'UG') {
          playerGradeArray.push(playerArray[i][disciplineGrade]);
        }
      }

      return playerGradeArray;
    }

    function getAverageGrade(grades) {
      if (grades.length === 0) {
        return 'UG';
      }
      // work out the values for each of the grades
      var gradeValues = [];

      for (var i = 0 ; i < grades.length ; i++) {
        var value = getGradePointsValue(grades[i]);
        if (value > 2)
        {
          gradeValues.push(value);
        }
      }

      // now total the scores and get an average
      var totalScore = 0;

      for (i = 0 ; i < gradeValues.length ; i++) {
        totalScore += gradeValues[i];
      }

      var average = totalScore / gradeValues.length;

      // work out what the closest grade value lower than this is
      var difference = -1;
      var returnGrade = "";

      for (i = 0 ; i < gradePoints.length ; i++) {
        var tempDiff = average - gradePoints[i].points;

        if (tempDiff >= 0) {
          if (difference == -1) {
            difference = tempDiff;
            returnGrade = gradePoints[i].grade;
          } else {
            if (tempDiff < difference) {
              difference = tempDiff;
              returnGrade = gradePoints[i].grade;
            }
          }
        }
      }
      return returnGrade;
    }


    return {
      getGradeValue: function (grade) {
        return getGradePointsValue(grade);
      },
      getGradeFromValue: function (value) {
        for (var i = 0 ; i < gradePoints.length ; i++)
        {
          if (gradePoints[i].points === value)
          {
            return gradePoints[i].grade;
          }
        }
        return '';
      },
      getOpponentGrade: function (match, player) {
        if (match.discipline.indexOf('Doubles') !== -1) {
          if (match.player1 === player.id || match.partner1 === player.id) {
            if (match.discipline.indexOf('Mixed') !== -1) {
              return playerService.getPlayer(match.player2).mixedGrade + '/' + playerService.getPlayer(match.partner2).mixedGrade;
            } else {
              return playerService.getPlayer(match.player2).doublesGrade + '/' + playerService.getPlayer(match.partner2).doublesGrade;
            }
          } else {
            if (match.discipline.indexOf('Mixed') !== -1) {
              return playerService.getPlayer(match.player1).mixedGrade + '/' + playerService.getPlayer(match.partner1).mixedGrade;
            } else {
              return playerService.getPlayer(match.player1).doublesGrade + '/' + playerService.getPlayer(match.partner1).doublesGrade;
            }
          }
        } else {
          if (match.player1 === player.id) {
            return playerService.getPlayer(match.player2).singlesGrade;
          } else {
            return playerService.getPlayer(match.player1).singlesGrade;
          }
        }
      },
      getMatchPoints: function () {

      },
      getPromotionValue: function (grade) {
        return getGradePromotionValue(grade);
      },
      getDemotionValue: function (grade) {
        return getGradeDemotionValue(grade);
      },
      getTeamGradeArray: getTeamGradeArray,
      getAverageGrade: getAverageGrade,
      getPlayerStatus: function (grade, average, demotionAverage) {
        if (average >= getGradePromotionValue(grade) && grade !== 'A2') {
          return 'promotion';
        } else if (demotionAverage < getGradeDemotionValue(grade) && grade !== 'E2') {
          return 'demotion';
        } else {
          return 'remain';
        }
      }
    };
  });
