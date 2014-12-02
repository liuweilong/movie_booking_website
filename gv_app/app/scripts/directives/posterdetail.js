'use strict';

/**
 * @ngdoc directive
 * @name gvApp.directive:poster
 * @description
 * # poster
 */
angular.module('gvApp')
.directive('posterDetail', function () {
	return {
		templateUrl: '../views/posterdetail.html',
		restrict: 'AE',
		link: function postLink(scope, element, attrs) {
			attrs.$observe('index', function() {
				scope.imgName = scope.imgNames[attrs.index];
			});
		}
	};
});
