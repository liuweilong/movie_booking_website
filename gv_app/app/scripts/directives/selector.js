'use strict';

/**
 * @ngdoc directive
 * @name gvApp.directive:selector
 * @description
 * # selector
 */

angular.module('gvApp')
.controller('selectorCtrl', ['$scope', '$element', '$attrs', 'movieData',
	function($scope, $element, $attrs, movieData){
	$scope.theaters = movieData.theaters;	

	$scope.selectTheater = function(theater) {
		console.log('selected' + theater);
	};
}])

.directive('selector', [function () {
	return {
		controller: 'selectorCtrl',
		templateUrl: '../views/selectorview.html',
		restrict: 'AE',
		link: function postLink(scope, element, attrs, ctrl) {
			// Change the position of the document
			angular.element(".spacer").css('height', angular.element('#header').outerHeight() + 'px');
		}
	};
}]);

