'use strict';

/**
 * @ngdoc directive
 * @name gvApp.directive:posters
 * @description
 * # posters
 */
angular.module('gvApp')
.controller('postersCtrl', 
	['$scope', '$attrs', '$document', '$window', 'global', 'movieData',
	function($scope, $attrs, $document, $window, global, moviewData){
		// Keep recording of poster views
		var posterViews = {};
		// getting movie data from movieData service
		this.posters = movieData.posters;
		this.current = -1;
		this.previewPos = -1;

		// register poster view
		this.registerPoster = function(ctrl) {
			posterVews[ctrl.name] = ctrl;
		};

		var showPreview = function(name) {
			var posterCtrl = posterViews[name],
				position = posterCtrl.offsetTop;

			global.scrolExtra = 0;

			if (this.current != -1) {
				if (this.previewPos != position) {
					if (position > this.previewPos) {
						global.scrolExtra = posterCtrl.originalHeight;
					};

					hidePreview();
				};
			};
		};

		var hidePreview = function() {
			posterViews[this.current].close();
			this.current = -1;
		};

		$scope.togglePreview = function() {

		};
}])
.directive('posters', function () {
	var link = function(scope, element, attrs) {

	}
	return {
		restrict: 'E',
		controller: 'postersCtrl',
		link: link
	};
});
