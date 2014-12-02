'use strict';

/**
 * @ngdoc directive
 * @name gvApp.directive:preview
 * @description
 * # preview
 */
 angular.module('gvApp')
 .controller('previewCtrl', ['$scope', '$element', '$attrs', 
 	function($scope, $element, $attrs){
 		this.element = $element;
 		this.offsetTop = $element.offset().top;
 }])
 .directive('preview', function () {
 	var setTransition = function (element) {
 		if (global.support) {
 			element.css( 'transition', 'height ' + global.settings.speed + 'ms ' + global.settings.easing );
 		};
 	}

 	// Link function
 	var link = function(scope, element, attrs, ctrls) {
 		var previewCtrl = ctrls[0],
 			posterCtrl = ctrls[1];

 		posterCtrl.registerPreview(previewCtrl);
 		setTransition(element);
 	}

 	return {
 		controller: 'previewCtrl',
 		require: ['preview', '^poster'],
 		restrict: 'E',
 		link: link
 	};
 });
