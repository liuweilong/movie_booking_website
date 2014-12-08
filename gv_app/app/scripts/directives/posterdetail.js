'use strict';

/**
 * @ngdoc directive
 * @name gvApp.directive:poster
 * @description
 * # poster
 */
angular.module('gvApp')
.controller('posterDetailCtrl', ['$scope', '$attrs', function($scope, $attrs){
	var self = this;

	self.$seatplan = $("#place");
	console.log(self.$seatplan);

	$scope.embedSelectTheater = function(theater) {
		if (theater !== $scope.selectedTheater) {
			$scope.selectedTheater = theater;
			$scope.days = $scope.movie.cinema[$scope.selectedTheater];
		};
	}

	$scope.showSeatplan = function(seatplan) {
		movieseat_init(self.$seatplan, seatplan);
	}

}])
.directive('posterDetail', ['$compile', function ($compile) {
	var link = function(scope, element, attrs) {

		// Observe index to get movie info.
		attrs.$observe('index', function() {
			// Set scope variables
			scope.movie = scope.movies[attrs.index];

			// Get all the theaters
			scope.embedtheaters = Object.keys(scope.movie.cinema);

			scope.theaterinfo = scope.movie.cinema;

			scope.weekdays = ["Thursday", "Friday", "Saturday", "Sunday", "Monday"];
			
			if (scope.selectedTheater === 'all') {
				scope.selectedTheater = scope.embedtheaters[0];
				scope.days = scope.movie.cinema[scope.selectedTheater];
			};

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
		controller: 'posterDetailCtrl',
		compile: function(tElem) {
			return link;
		}
	};
}]);
