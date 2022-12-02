'use strict';

/**
 * @ngdoc function
 * @name serranoApp.controller:MatchValidationErrorsCtrl
 * @description
 * # MatchValidationErrorsCtrl
 * Controller of the NBAApp
 */
angular.module('NBAApp')
  .controller('MatchValidationErrorsCtrl', function ($scope, validateLeagueMatchService) {

    $scope.errorStrings = validateLeagueMatchService.getErrorStrings();

  });
