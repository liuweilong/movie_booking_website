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
		var self = this;

		this.posterGridCtrl;

		this.selectedList = {};

		$scope.selectedTheater = 'all';

		this.init = function() {
			$scope.expanded = false;
			$scope.fixed = false;

			/*
			Pre set the select flag to be false
			 */
			for (var theater in $scope.theaters) {
				self.selectedList[$scope.theaters[theater]] = false;
			}
		}

		this.registerGrid = function(posterGridCtrl) {
			this.posterGridCtrl = posterGridCtrl;
		};

		this.expand = function(expanded) {
			$scope.expanded = expanded;
		}

		$scope.theaters = movieData.theaters;
		/*
		
		 */
		$scope.selected = function(theater) {
			if ($scope.selectedTheater === theater) {
				return true;
			}
		};

		/*
		
		 */
		$scope.selectTheater = function(theater) {
			if (self.selectedList[theater] === true) {
				self.selectedList[theater] = false;
			} else {
				self.selectedList[theater] = true;
			}
			if (theater === $scope.selectedTheater) {
				$scope.selectedTheater = 'all';
			} else {
				$scope.selectedTheater = theater;
			}
			self.posterGridCtrl.select($scope.selectedTheater);
		};
}])

.directive('selector', ["$window", function ($window) {

	var link = function(scope, element, attrs, selectorCtrl) {
		selectorCtrl.init();

		// Bind scroll on window
		angular.element($window).bind("scroll", function() {
			if (this.pageYOffset >50) {
				scope.fixed = true;
			} else {
				scope.fixed = false;
			}

			scope.$apply();
		});
	};

	return {
		controller: 'selectorCtrl',
		templateUrl: '../views/selectorview.html',
		restrict: 'AE',
		link: link
	};
}]);

