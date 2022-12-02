'use strict';

/**
 * @ngdoc overview
 * @name NBAApp
 * @description
 * # NBAApp
 *
 * Main module of the application.
 */
angular
  .module('NBAApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngMaterial',
    'ui.bootstrap',
    'angularUtils.directives.dirPagination',
    'ngMap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:param', {
        templateUrl: 'views/clubView.html',
        controller: 'ClubViewCtrl'
      })
      .when('/', {
        templateUrl: 'views/clubView.html',
        controller: 'ClubViewCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
