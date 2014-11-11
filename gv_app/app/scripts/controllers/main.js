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

    $scope.expand = [];

    $scope.len = $scope.imgNames.length;

    while($scope.len--) $scope.expand.push(false);

    $scope.expander = function(index) {
    	$scope.expand[index] = !$scope.expand[index];
    	for (var i = $scope.expand.length -1; i >= 0; i--) {
    		if (i != index) {
    			$scope.expand[i] = false;
    		};
    	};
    }
  });
