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

    $scope.allPlayersClick = function() {
      if (!autoSelectClick) {
        $location.url('/all');
      } else {
        var url = $location.url();
        if (url.indexOf('/ms') !==-1) {
          $scope.selectedIndex = 1;
        } else if (url.indexOf('/ls') !==-1) {
          $scope.selectedIndex = 2;
        } else if (url.indexOf('/md') !==-1) {
          $scope.selectedIndex = 3;
        } else if (url.indexOf('/ld') !==-1) {
          $scope.selectedIndex = 4;
        } else if (url.indexOf('/mxd') !==-1) {
          $scope.selectedIndex = 5;
        } else if (url.indexOf('/lxd') !==-1) {
          $scope.selectedIndex = 6;
        } else if (url.indexOf('/player') !==-1) {
          $scope.selectedIndex = -1;
          autoSelectClick = false;
        } else {
          $scope.selectedIndex = 0;
          autoSelectClick = false;
        }
      }
    };

    $scope.msClick = function() {
      if (!autoSelectClick) {
        $location.url('/ms');
      } else {
        autoSelectClick = false;
      }
    };

    $scope.lsClick = function() {
      if (!autoSelectClick) {
        $location.url('/ls');
      } else {
        autoSelectClick = false;
      }
    };

    $scope.mdClick = function() {
      if (!autoSelectClick) {
        $location.url('/md');
      } else {
        autoSelectClick = false;
      }
    };

    $scope.ldClick = function() {
      if (!autoSelectClick) {
        $location.url('/ld');
      } else {
        autoSelectClick = false;
      }
    };

    $scope.mxdClick = function() {
      if (!autoSelectClick) {
        $location.url('/mxd');
      } else {
        autoSelectClick = false;
      }
    };

    $scope.lxdClick = function() {
      if (!autoSelectClick) {
        $location.url('/lxd');
      } else {
        autoSelectClick = false;
      }
    };
  });
