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

    function getNextGrade(grade) {
      var gradeIndex = 0;

      for (var i = 0 ; i < gradePoints.length ; i++) {
        if (gradePoints[i].grade === grade) {
          gradeIndex = i;
        }
      }

      if (gradeIndex === 0) {
        return 'CANNOT';
      } else {
        return gradePoints[gradeIndex-1].grade;
      }
    }

    function getPrevGrade(grade) {
      var gradeIndex = 0;

      for (var i = 0 ; i < gradePoints.length ; i++) {
        if (gradePoints[i].grade === grade) {
          gradeIndex = i;
        }
      }

      if (gradeIndex === gradePoints.length - 1) {
        return 'CANNOT';
      } else {
        return gradePoints[gradeIndex+1].grade;
      }
    }

    function isGradeMoreThan1DivisionHigher(grade, opponentGrade) {
      var gradeIndex = getGradeIndex(grade);
      var opponentGradeIndex = getGradeIndex(opponentGrade);

      // if the grade is a whole number
      if ((gradeIndex % 1) === 0) {
        // if the grade index is is a multiple of 2, then the opponent grade must be
        // more than 3 higher to return true
        if ((gradeIndex % 2) === 0) {
          return ((gradeIndex - opponentGradeIndex) > 3);
        } else {
          // if the grade index is is a multiple of 2, then the opponent grade must be
          // more than 2 higher to return true
          return ((gradeIndex - opponentGradeIndex) > 2);
        }
      } else {
        // in this case the opponent grade must be
        // more than 3 higher to return true
        return ((gradeIndex - opponentGradeIndex) > 3);
      }
    }

    function isGradeHigher(grade, opponentGrade) {
      var gradeIndex = getGradeIndex(grade);
      var opponentGradeIndex = getGradeIndex(opponentGrade);

      return opponentGradeIndex < gradeIndex;
    }

    function getGradeIndex(grade) {
      // is it a composite grade?
      if (grade.indexOf('/') !== -1) {
        var grade1 = grade.substring(0, grade.indexOf('/'));
        var grade2 = grade.substring(grade.indexOf('/') + 1, grade.length);

        return (getGradeIndex(grade1) + getGradeIndex(grade2)) / 2;
      } else {
        for (var i = 0 ; i < gradePoints.length ; i++) {
          if (gradePoints[i].grade === grade) {
            return i;
          }
        }
      }
      return -1;
    }

    function getGrade(player, match) {
      if (!player || player === null)
      {
        return '';
      }

      if (match.discipline.indexOf('Singles') !== -1)
      {
        return player.singlesGrade;
      }
      else if (match.discipline.indexOf('Mixed') !== -1)
      {
        return player.mixedGrade;
      }
      else if (match.discipline.indexOf('Doubles') !== -1)
      {
        return player.doublesGrade;
      }
      else
      {
        return '';
      }
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
            getPlayerStatus: function (grade, average, demotionAverage) {
                if (average >= getGradePromotionValue(grade) && grade !== 'A2') {
                    return 'promotion';
                } else if (demotionAverage < getGradeDemotionValue(grade) && grade !== 'E2') {
                    return 'demotion';
               } else {
                 return 'remain';
               }
            },
            getNextGrade: getNextGrade,
            getPrevGrade: getPrevGrade,
            isGradeMoreThan1DivisionHigher: isGradeMoreThan1DivisionHigher,
            isGradeHigher: isGradeHigher,
            getGrade: getGrade
        };
});
