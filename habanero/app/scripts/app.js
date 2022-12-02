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
      .when('/all/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/player/:param', {
        templateUrl: 'views/player.html',
        controller: 'PlayerCtrl',
        reloadOnSearch: false
      })
      .when('/:param', {
        templateUrl: 'views/rankings.html',
        controller: 'RankingsCtrl',
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/all/'
      });
  }).run(function($rootScope, $location, $routeParams, $window){
  $rootScope.$on('$routeChangeSuccess', function() {
    var output=$location.absUrl()+'?';
    angular.forEach($routeParams,function(value,key){
      output+=key+'='+value+'&';
    });
    output=output.substr(0,output.length-1);
    //$window.ga('send', 'page', output);
    $window.ga('send', 'pageview', { page: output });
  });
});
