'use strict';

/**
 * @ngdoc function
 * @name gvApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gvApp
 */
angular.module('gvApp')
  .controller('MainCtrl', function ($scope) {
    $scope.imgNames = [
    	'1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'
    ];
  });
