'use strict';

/**
 * @ngdoc service
 * @name gvApp.global
 * @description
 * # global
 * Service in the gvApp.
 */
angular.module('gvApp')
.service('global', ['$window', '$document', function ($window, $document) {
	this.support = Modernizr.csstransitions;
	var transEndEventNames = {
	        'WebkitTransition' : 'webkitTransitionEnd',
	        'MozTransition' : 'transitionend',
	        'OTransition' : 'oTransitionEnd',
	        'msTransition' : 'MSTransitionEnd',
	        'transition' : 'transitionend'
	    };
	this.transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ];
	this.settings = {
		minHeight : 500,
		speed : 350,
		easing : 'ease'
	};

	this.scrollExtra = 0;
	this.marginExpanded = 10;

	this.$body = angular.element($document[0].body);
	this.winsize = {width: $window.innerWidth, height: $window.innerHeight};
}]);
