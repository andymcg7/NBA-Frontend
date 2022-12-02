'use strict';

/**
 * @ngdoc function
 * @name NBAApp.controller:TabCtrl
 * @description
 * # TabCtrl
 * Controller of the menu tabs
 */
angular.module('NBAApp')
  .controller('TabCtrl', function ($scope, $location) {

    var autoSelectClick = true;

    $scope.mdClick = function() {
      if (!autoSelectClick) {
        $location.url('/md');
      } else {
        var url = $location.url();
        if (url.indexOf('/ld') !==-1) {
          $scope.selectedIndex = 1;
        } else if (url.indexOf('/mx') !==-1) {
          $scope.selectedIndex = 2;
        } else if (url.indexOf('/md') !==-1) {
          $scope.selectedIndex = 0;
          autoSelectClick = false;
        }
        else {
          $scope.selectedIndex = -1;
          autoSelectClick = false;
        }
      }
    };

    $scope.ldClick = function() {
      if (!autoSelectClick) {
        $location.url('/ld');
      } else {
        autoSelectClick = false;
      }
    };

    $scope.mxClick = function() {
      if (!autoSelectClick) {
        $location.url('/mx');
      } else {
        autoSelectClick = false;
      }
    };
  });
