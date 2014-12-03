'use strict';

/**
 * @ngdoc directive
 * @name gvApp.directive:poster
 * @description
 * # poster
 */
angular.module('gvApp')
.controller('posterCtrl', ['$scope', '$element', '$attrs', 
	function($scope, $element, $attrs){
		this.element = $element;
		this.name = $attrs.name;
		this.offsetTop = element.offset().top;
		this.originalHeight = element.height();

		this.registerPreview = function(previewCtrl) {
			this.previewCtrl = previewCtrl;
		};

		this.open = function() {
			var self = this,
				onEndFn = function() {
					if (global.support) {
						self.element.off(global.transEndEventName);
					};
					self.element.addClass('og-expanded');
				}

			calcHeight();
			self.previewCtrl.element.css('height', self.previewHeight);
			self.element.css('height', self.height).on(global.transEndEventName, onEndFn);

			if (!global.support) {
				onEndFn.call();
			};

			positionPreview();
		};

		this.close = function() {
			var self = this,
				onEndFn = function() {
					if (global.support) {
						$( this ).off(global.transEndEventName);
					};
					self.element.removeClass('og-expanded');
					// @todo remove element
				};
			setTimeout($.proxy(function() {
				self.previewCtrl.element.css('height', 0);
				self.element.css('height', self.originalHeight).on(global.transEndEventName, onEndFn);

				if (!global.support) {
					onEndFn.call();
				};
			}, this), 25);
		};

		var calcHeight = function() {
			var heightPreview = global.winsize.height - this.originalHeight - global.marginExpanded,
			    itemHeight = global.winsize.height;
			
			if( heightPreview < global.settings.minHeight ) {
			    heightPreview = global.settings.minHeight;
			    itemHeight = global.settings.minHeight + this.originalHeight + global.marginExpanded;
			}
			
			this.height = itemHeight;
			this.previewHeight = heightPreview;
		};

		var positionPreview = function() {
			// scroll page
			// case 1 : preview height + item height fits in window´s height
			// case 2 : preview height + item height does not fit in window´s height and preview height is smaller than window´s height
			// case 3 : preview height + item height does not fit in window´s height and preview height is bigger than window´s height
			var position = this.offsetTop,
				previewOffsetT = this.previewCtrl.offsetTop - global.scrollExtra,
				scrollVal = this.height <= global.winsize.height ? position : this.previewHeight < global.winsize.height ? previewOffsetT - ( global.winsize.height - this.previewHeight ) : previewOffsetT;
			
			global.$body.animate( { scrollTop : scrollVal }, global.settings.speed );
		};
}])
.directive('poster', ['global', function (global) {
	var setTransition = function (element) {
		if (global.support) {
			element.css( 'transition', 'height ' + global.settings.speed + 'ms ' + global.settings.easing );
		};
	}

	// Link function
	var link = function(scope, element, attrs, ctrls) {
		var postersCtrl = ctrls[1],
			posterCtrl = ctrls[0];

		postersCtrl.registerPoster(posterCtrl);
		// set transition if support
		setTransition(element);
	}

	return {
		controller: 'posterCtrl',
		require: ['poster', '^posters'],
		restrict: 'E',
		link: link
	};
}]);
