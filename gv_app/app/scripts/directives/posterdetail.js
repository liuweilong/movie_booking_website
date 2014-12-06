'use strict';

/**
 * @ngdoc directive
 * @name gvApp.directive:poster
 * @description
 * # poster
 */
angular.module('gvApp')
.directive('posterDetail', ['$compile', function ($compile) {
	var link = function(scope, element, attrs) {
			// Find trailer link
		attrs.$observe('index', function() {
			scope.movie = scope.movies[attrs.index];

			element.find('.video-link').jqueryVideoLightning({
				id: "y-" + scope.movie.trailerLink,
				autoplay: 1,
				backdrop_color: "#ddd",
				backdrop_opacity: 0.6,
				glow: 20,
				glow_color: "#000"
			});
		});
	};

	return {
		templateUrl: '../views/posterdetail.html',
		replace: true,
		restrict: 'AE',
		compile: function(tElem) {
			return link;
		}
	};
}]);
