'use strict';

angular.module('NBAApp')
  .service('calculatePlayerAverageService', function(playerService, matchesService, gradeService, matchUtilityService) {


    var SINGLES_MIN_COUNTING_MATCHES = 6;
    var DOUBLES_MIN_COUNTING_MATCHES = 12;
    var MIXED_MIN_COUNTING_MATCHES = 12;

    function calculatePlayersAverages(players) {
      for (var i = 0 ; i < players.length ; i++) {
        calculatePlayerAverages(players[i]);
      }
    }

    function calculatePlayerAverages(player) {
      if (!player) {
        return;
      }

      // get all of the matches for this player
      var playerMatches = matchesService.getMatchesForPlayerFromExistingData(player.id);

      var singlesMatches = [];
      var doublesMatches = [];
      var mixedMatches = [];

      // now separate these matches into disciplines
      for (var i = 0 ; i < playerMatches.length ; i++) {
        if (playerMatches[i].discipline.indexOf('Singles') !== -1) {
          singlesMatches.push(playerMatches[i]);
        } else if (playerMatches[i].discipline.indexOf('Mixed') !== -1) {
          mixedMatches.push(playerMatches[i]);
        } else {
          doublesMatches.push(playerMatches[i]);
        }
      }

      calculateDisciplineAverage(player, 'Singles', singlesMatches);
      calculateDisciplineAverage(player, 'Doubles', doublesMatches);
      calculateDisciplineAverage(player, 'Mixed', mixedMatches);
    }


    function MatchForAverage(player, match) {
      this.playerGrade = '';
      this.opponentGrade = '';
      this.points = 0;
      this.player1 = playerService.getPlayer(match.player1);
      this.player2 = playerService.getPlayer(match.player2);
      this.partner1 = null;
      this.partner2 = null;
      this.team1Victory = false;

      // now work out who won the match
      if (matchUtilityService.getMatchResult(match.team1Score1, match.team2Score1,
          match.team1Score2, match.team2Score2,
          match.team1Score3, match.team2Score3)) {
        this.team1Victory = true;
      }

      if (match.discipline.indexOf('Doubles') !== -1) {
        this.partner1 = playerService.getPlayer(match.partner1);
        this.partner2 = playerService.getPlayer(match.partner2);
      }

      if (match.discipline === 'Mens Singles' || match.discipline === 'Ladies Singles') {
        this.playerGrade = player.singlesGrade;
        if (this.player1.id === player.id) {
          this.opponentGrade = this.player2.singlesGrade;
          if (this.team1Victory) {
            this.points = gradeService.getGradeValue(this.opponentGrade);
          } else {
            this.points = 0;
          }
        } else {
          this.opponentGrade = this.player1.singlesGrade;
          if (!this.team1Victory) {
            this.points = gradeService.getGradeValue(this.opponentGrade);
          } else {
            this.points = 0;
          }
        }
      } else if (match.discipline === 'Singles League') {
        this.playerGrade = player.singlesGrade;
        if (this.player1.id === player.id) {
          if (player.gender === 'Male') {
            if (this.player2.gender === 'Female') {
              // If a male plays a female the grade is 2 below the actual grade of the female
              this.opponentGrade = gradeService.getPrevGrade(gradeService.getPrevGrade(this.player2.singlesGrade));

              if (this.opponentGrade === 'CANNOT') {
                this.opponentGrade = 'E2';
              }
            } else {
              this.opponentGrade = this.player2.singlesGrade;
            }

            if (this.team1Victory) {
              this.points = gradeService.getGradeValue(this.opponentGrade);
            } else {
              this.points = 0;
            }
          } else {
            if (this.player2.gender === 'Male') {
              // If a female plays a male the actual grade of the male is 2 above
              var grade1 = gradeService.getNextGrade(this.player2.singlesGrade);
              var grade2 = '';
              var multiplier = 1;
              if (grade1 === 'CANNOT') {
                // male is an A2
                this.opponentGrade = 'A2';
                // multiplier = 4;
              } else {
                grade2 = gradeService.getNextGrade(grade1);

                if (grade2 === 'CANNOT') {
                  // male is a B1
                  this.opponentGrade = 'A2';
                  // multiplier = 2;
                } else {
                  this.opponentGrade = grade2;
                }
              }

              if (this.team1Victory) {
                this.points = gradeService.getGradeValue(this.opponentGrade) * multiplier;
              } else {
                this.points = 0;
              }
            } else {
              this.opponentGrade = this.player2.singlesGrade;

              if (this.team1Victory) {
                this.points = gradeService.getGradeValue(this.opponentGrade);
              } else {
                this.points = 0;
              }
            }
          }
        } else {
          this.opponentGrade = this.player1.singlesGrade;
          if (!this.team1Victory) {
            this.points = gradeService.getGradeValue(this.opponentGrade);
          } else {
            this.points = 0;
          }
        }
      } else if (match.discipline.indexOf('Doubles') !== -1) {
        if (this.player1.id === player.id) {
          this.playerGrade = gradeService.getGrade(player, match) + '/' + gradeService.getGrade(this.partner1, match);
          this.opponentGrade = gradeService.getGrade(this.player2, match) + '/' + gradeService.getGrade(this.partner2, match);

          if (this.team1Victory) {
            this.points = gradeService.getGradeValue(this.opponentGrade);
          } else {
            this.points = 0;
          }
        } else if (this.partner1.id === player.id) {
          this.playerGrade = gradeService.getGrade(player, match) + '/' + gradeService.getGrade(this.player1, match);
          this.opponentGrade = gradeService.getGrade(this.player2, match) + '/' + gradeService.getGrade(this.partner2, match);

          if (this.team1Victory) {
            this.points = gradeService.getGradeValue(this.opponentGrade);
          } else {
            this.points = 0;
          }
        } else if (this.player2.id === player.id) {
          this.playerGrade = gradeService.getGrade(player, match) + '/' + gradeService.getGrade(this.partner2, match);
          this.opponentGrade = gradeService.getGrade(this.player1, match) + '/' + gradeService.getGrade(this.partner1, match);

          if (!this.team1Victory) {
            this.points = gradeService.getGradeValue(this.opponentGrade);
          } else {
            this.points = 0;
          }
        } else if (this.partner2.id === player.id) {
          this.playerGrade = gradeService.getGrade(player, match) + '/' + gradeService.getGrade(this.player2, match);
          this.opponentGrade = gradeService.getGrade(this.player1, match) + '/' + gradeService.getGrade(this.partner1, match);

          if (!this.team1Victory) {
            this.points = gradeService.getGradeValue(this.opponentGrade);
          } else {
            this.points = 0;
          }
        }
      }
    }

    function sortNumber(a,b) {
      return b - a;
    }

    // quick function to sum all of the points in this array
    function sumArray(array, field) {
      var total = 0;
      var i;

      if (!field) {
        for (i = 0 ; i < array.length ; i++) {
          total += array[i];
        }
      } else {
        for (i = 0 ; i < array.length ; i++) {
          var obj = array[i];
          total += obj.points;
        }
      }
      return total;
    }

    function calculateDisciplineAverage(player, discipline, matches) {

      // first convert our match array to something we can understand in the context of an
      // average calculation

      var matchArray = [];

      for (var i = 0; i < matches.length; i++) {
        if (discipline === 'Mixed') {
          if (matches[i].discipline === 'Mixed Doubles' && matches[i].approved && matches[i].matchPlayed) {
            matchArray.push(new MatchForAverage(player, matches[i]));
          }
        } else if (discipline === 'Doubles') {
          if ((matches[i].discipline === 'Mens Doubles' || matches[i].discipline === 'Ladies Doubles') && matches[i].approved && matches[i].matchPlayed) {
            matchArray.push(new MatchForAverage(player, matches[i]));
          }
        } else {
          if (discipline.indexOf('Singles') !== -1 && matches[i].discipline === 'Singles League' && matches[i].approved && matches[i].matchPlayed) {
            matchArray.push(new MatchForAverage(player, matches[i]));
          }
        }
      }

      var minCountingMatches = 0;

      var matchesPlayed = matchArray.length;
      var totalPoints = sumArray(matchArray, 'points');

      var newArray = [];
      //var workingArray = matchArray.slice();
      var winArray = [];
      var defeatCount = 0;

      var playerGrade = '';
      if (discipline.indexOf('Singles') !== -1) {
        playerGrade = player.singlesGrade;
        minCountingMatches = SINGLES_MIN_COUNTING_MATCHES;
      } else if (discipline.indexOf('Mixed') !== -1) {
        playerGrade = player.mixedGrade;
        minCountingMatches = MIXED_MIN_COUNTING_MATCHES;
      } else {
        playerGrade = player.doublesGrade;
        minCountingMatches = DOUBLES_MIN_COUNTING_MATCHES;
      }

      // put the zeroes(defeats) into the array first
      for (i = 0; i < matchArray.length; i++) {
        if (matchArray[i].points === 0) {
          // should the defeat be included?
          var invalidOpponentGrade = gradeService.isGradeMoreThan1DivisionHigher(matchArray[i].playerGrade, matchArray[i].opponentGrade);
          if (!invalidOpponentGrade) {
            defeatCount++;
            newArray.push(0);
          }
        } else {
          winArray.push(matchArray[i].points);
        }
      }

      // now sort our array into descending totals
      winArray.sort(sortNumber);

      // now start adding the points, value by value and see what the best average
      // is
      var average = 0;
      var countingMatches = 0;
      var bestPoints = 0;

      for (i = 0; i < winArray.length; i++) {
        newArray.push(winArray[i]);

        // sum this array
        var totalScore = sumArray(newArray);

        // if the length of this array is equal to or greater than the minimum number
        // of counting matches we can divide by the length, otherwise we need to
        // divide by the min counting matches
        var ave = 0;
        var divider = 0;
        if (newArray.length >= minCountingMatches) {
          ave = totalScore / newArray.length;
          divider = newArray.length;
        } else {
          ave = totalScore / minCountingMatches;
          divider = minCountingMatches;
        }

        // if this score is better then store it
        if (ave > average) {
          average = ave;
          countingMatches = divider;
          bestPoints = totalScore;
        }
      }

      // now work out the demotion average
      // count up all of the points from all of the wins, and only include defeats that
      // are not against better players/pairs
      var demotionArray = [];

      for (i = 0; i < matchArray.length; i++) {
        if (matchArray[i].points > 0) {
          demotionArray.push(matchArray[i].points);
        } else {
          // if this defeat was to higher graded players then don't include it
          if (!gradeService.isGradeHigher(matchArray[i].playerGrade, matchArray[i].opponentGrade)) {
            demotionArray.push(0);
          }
        }
      }
      var demotionAverage;
      if (demotionArray.length === 0) {
        demotionAverage = 0;
      } else {
        demotionAverage = sumArray(demotionArray) / demotionArray.length;
      }

      if (discipline.indexOf('Singles') !== -1) {
        player.singlesMatchesPlayed = matchesPlayed;
        player.singlesTotalPoints = totalPoints;
        player.singlesAverage = average;
        player.singlesBestPoints = bestPoints;
        player.singlesCountingMatches = countingMatches;
        player.singlesDemotionAverage = demotionAverage;
      } else if (discipline.indexOf('Mixed') !== -1) {
        player.mixedMatchesPlayed = matchesPlayed;
        player.mixedTotalPoints = totalPoints;
        player.mixedAverage = average;
        player.mixedBestPoints = bestPoints;
        player.mixedCountingMatches = countingMatches;
        player.mixedDemotionAverage = demotionAverage;
      } else if (discipline.indexOf('Doubles') !== -1) {
        player.doublesMatchesPlayed = matchesPlayed;
        player.doublesTotalPoints = totalPoints;
        player.doublesAverage = average;
        player.doublesBestPoints = bestPoints;
        player.doublesCountingMatches = countingMatches;
        player.doublesDemotionAverage = demotionAverage;
      }
    }

    return {
      calculatePlayersAverages: calculatePlayersAverages
    };
  });
