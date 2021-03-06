'use strict';

/**
 * @ngdoc overview
 * @name gvApp
 * @description
 * # gvApp
 *
 * Main module of the application.
 */
angular
  .module('gvApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
      })
      .otherwise({
        redirectTo: '/'
      });
  });
