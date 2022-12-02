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
    'angularUtils.directives.dirPagination'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:param', {
        templateUrl: 'views/leagueTables.html',
        controller: 'LeagueTablesCtrl'
      })
      .when('/leagueMatch/:param', {
        templateUrl: 'views/leagueMatch.html',
        controller: 'LeagueMatchCtrl'
      })
      .otherwise({
        redirectTo: '/md'
      });
  }).run(function($rootScope, $location, $routeParams, $window){
  $rootScope.$on('$routeChangeSuccess', function() {
    var output=$location.url()+'?';
    angular.forEach($routeParams,function(value,key){
      output+=key+'='+value+'&';
    });
    output=output.substr(0,output.length-1);
    //$window.ga('send', 'page', output);
    $window.ga('send', 'pageview', { page: output });
  });
});
