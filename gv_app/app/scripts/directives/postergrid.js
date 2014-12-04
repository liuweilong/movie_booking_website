'use strict';

/**
 * @ngdoc directive
 * @name gvApp.directive:posterGrid
 * @description
 * # posterGrid
 */
angular.module('gvApp')
.factory('previewFactory', ['posterGridService', '$compile', function(posterGridService, $compile){
	var preview = function(item, index, scope) {
		this.$item = item;
		this.expandedIdx = index;
		this.create(index, scope);
		this.update(index, scope);
	};

	preview.prototype = {
		create : function(index, scope) {
		    this.$previewInner = $compile('<poster-detail index='+ index +'></poster-detail>')(scope);
		    this.$previewEl = $( '<div class="og-expander"></div>' ).append( this.$previewInner );
		    // append preview element to the item
		    this.$item.append( this.getEl() );
		    // set the transitions for the preview and the item
		    if( posterGridService.support ) {
		        this.setTransition();
		    }
		},

		update: function(index, scope, $item) {
			if ($item) {
				this.$item = $item;
				this.$previewInner = $compile('<poster-detail index='+ index +'></poster-detail>')(scope);
			};

			if (posterGridService.current !== -1) {
				var $currentItem = posterGridService.$items.eq(posterGridService.current);
				$currentItem.removeClass('og-expanded');
				this.$item.addClass('og-expanded');
				this.positionPreview();
			} else {
				this.$item.addClass('og-expanded');
			};

			posterGridService.current = index;
		},

		open: function() {
			var self = this,
				onEndFn = function() {
					if (posterGridService.support) {
						self.$item.off(posterGridService.transEndEventName);
					}
					self.$item.addClass('og-expanded');
				};
			this.calcHeight();
			this.$previewEl.css('height', this.height);
			this.$item.css( 'height', this.itemHeight ).on( posterGridService.transEndEventName, onEndFn );

			if (!posterGridService.support) {
				onEndFn.call();
			};

			this.positionPreview();
		},

		calcHeight : function() {
		 
		    var heightPreview = posterGridService.winsize.height - this.$item.data( 'height' ) - posterGridService.marginExpanded,
		        itemHeight = posterGridService.winsize.height;
		 
		    if( heightPreview < posterGridService.settings.minHeight ) {
		        heightPreview = posterGridService.settings.minHeight;
		        itemHeight = posterGridService.settings.minHeight + this.$item.data( 'height' ) + posterGridService.marginExpanded;
		    }
		 
		    this.height = heightPreview;
		    this.itemHeight = itemHeight;
		 
		},

		positionPreview : function() {

			// scroll page
			// case 1 : preview height + item height fits in window´s height
			// case 2 : preview height + item height does not fit in window´s height and preview height is smaller than window´s height
			// case 3 : preview height + item height does not fit in window´s height and preview height is bigger than window´s height
			var position = this.$item.data( 'offsetTop' ),
				previewOffsetT = this.$previewEl.offset().top - posterGridService.scrollExtra,
				scrollVal = this.itemHeight <= posterGridService.winsize.height ? position : this.height < posterGridService.winsize.height ? previewOffsetT - ( posterGridService.winsize.height - this.height ) : previewOffsetT;
			
			posterGridService.$body.animate( { scrollTop : scrollVal }, posterGridService.settings.speed );

		},
		setTransition  : function() {
			this.$previewEl.css( 'transition', 'height ' + posterGridService.settings.speed + 'ms ' + posterGridService.settings.easing );
			this.$item.css( 'transition', 'height ' + posterGridService.settings.speed + 'ms ' + posterGridService.settings.easing );
		},
		getEl : function() {
			return this.$previewEl;
		},

		close : function() {
		    var self = this,
		        onEndFn = function() {
		            if( posterGridService.support ) {
		                $( this ).off( posterGridService.transEndEventName );
		            }
		            self.$item.removeClass( 'og-expanded' );
		            self.$previewEl.remove();
		        };
		 
		    setTimeout( $.proxy( function() {
		 
		        if( typeof this.$largeImg !== 'undefined' ) {
		            this.$largeImg.fadeOut( 'fast' );
		        }
		        this.$previewEl.css( 'height', 0 );
		        // the current expanded item (might be different from this.$item)
		        var $expandedItem = posterGridService.$items.eq( this.expandedIdx );
				$expandedItem.css( 'height', posterGridService.itemHeight[this.expandedIdx] ).on( posterGridService.transEndEventName, onEndFn );
		 
		        if( !posterGridService.support ) {
		            onEndFn.call();
		        }
		 
		    }, this ), 25 );
		     
		    return false;
		 
		}
	}

	return preview;
}])
.service('posterGridService', 
	['$document', '$window', function($document, $window){
		this.itemHeight = [],
		this.itemOffsetTop = [],
		this.support = Modernizr.csstransitions;
		this.current = -1;
		this.previewPos = -1;
		this.scrollExtra = 0;
		this.marginExpanded = 10;
		this.$window = $window;
		this.winsize =  {width: $window.innerWidth, height: $window.innerHeight};
		this.$body = angular.element($document[0].body);
		var transEndEventNames = {
		        'WebkitTransition' : 'webkitTransitionEnd',
		        'MozTransition' : 'transitionend',
		        'OTransition' : 'oTransitionEnd',
		        'msTransition' : 'MSTransitionEnd',
		        'transition' : 'transitionend'
		    };
		this.transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ];
		// support for csstransitions
		this.support = Modernizr.csstransitions;
		// default settings
		this.settings = {
			minHeight : 500,
			speed : 100,
			easing : 'ease'
		};
		this.getWinSize = function() {
			// console.log("getting");
			this.winsize = {width: $window.innerWidth, height: $window.innerHeight};
		};

		this.setItems = function(items) {
			if (typeof this.$items === 'undefined') {
				this.$items = items;
				// console.log(items);
				this.saveItemInfo(true);
			};
		}

		this.saveItemInfo = function(saveheight) {
			var self = this;
			this.$items.each(function() {
				var $item = $(this);
				$item.data('offsetTop', $item.offset(). top);
				self.itemOffsetTop.push($item.offset().top);
				if (saveheight) {
					// console.log($item.height());
					self.itemHeight.push($item.height());
					$item.data('height', $item.height());
				};
			});
		};
}])

.controller('posterGridCtrl', 
	['$scope', '$attrs', 'posterGridService', 'previewFactory', 'movieData', function($scope, $attrs, posterGridService, previewFactory, movieData){
		var self = this;

		this.hovering = false;

		/*
		Initialization 
		 */
		this.init = function(element) {
			this.$element = element;
			posterGridService.getWinSize();
		};

		/*
		This is a listener for select events from selector, will be called when a cinema is selected
		 */
		this.select = function(selectedTheater) {
			$scope.selectedTheater = selectedTheater;
		}

		/*
		Whether a overlay should be added
		 */
		$scope.addClassOverlay = function(movie) {
			if ($scope.hovered === movie && $scope.expanded !== $scope.hovered) {
				return true;
			};
			return false;
		}

		/*
		Event handler for mouseover event
		 */
		$scope.showOverlay = function(movie) {
			if (!self.hovering) {
				$scope.hovered = movie;
				console.log('mouseover event' + movie.movieName);
				self.hovering = true;
			};
		}

		/*
		Event handler for mouseleave event
		 */
		$scope.hideOverlay = function(movie) {
			if ($scope.hovered) {
				delete $scope.hovered;
				self.hovering = false;
				console.log('mouseleave event' + movie.movieName);
			};
		}

		/*
		Determine whether a poster show shold or not. For the function of location filter
		 */
		$scope.show = function(movie) {
			if ($scope.selectedTheater === 'all' | typeof $scope.selectedTheater === 'undefined') {
				return true;
			};

			for (var theater in movie.cinema) {
				if ($scope.selectedTheater === movie.cinema[theater]) {
					return true;
				};
			}

			return false;
		}

		$scope.hidePreview = function() {
			if ($scope.expanded) {
				delete $scope.expanded;
			};
			posterGridService.current = -1;
			var preview = $.data( this, 'preview' );
			preview.close();
			$.removeData( this, 'preview' );
		};

		$scope.showPreview = function(item, index, movie) {
			$scope.expanded = movie;

			var preview = $.data( this, 'preview' ),
				position = item.data('offsetTop');

			// posterGridService.path = '../rec/' + $scope.imgNames[index];
			posterGridService.scrollExtra = 0;

			if (posterGridService.current != -1) {
				if (posterGridService.previewPos != position) {
					if (position > posterGridService.previewPos) {
						posterGridService.scrollExtra = preview.height;
					};
					$scope.hidePreview();
				}

				else {
					// console.log('updating');
					preview.update(index, $scope, item);
					return false;
				}
			}

			posterGridService.previewPos = position;
			preview = $.data(this, 'preview', new previewFactory(item, index, $scope));
			preview.open();
		};

		$scope.togglePreview = function($event, index, movie) {
			$scope.expanded = movie;

			this.index = index;

			var item = angular.element($event.target).parent().parent();
			var items = angular.element($event.target).parent().parent().parent().children();
			posterGridService.setItems(items);
			posterGridService.current === index ? $scope.hidePreview() : $scope.showPreview(item, index, movie);
		};

		movieData.queryData().success(function(responce) {
			$scope.movies = responce;
		})
}])

.directive('posterGrid', function () {
	var fixPosition = function() {
		angular.element("#spacer-header").css('height', angular.element('#header').outerHeight() + 'px');
		angular.element("#spacer-selector").css('height', angular.element('.selector').outerHeight() + 'px');
	};

	var link = function(scope, element, attrs, ctrl) {
		fixPosition();

		/*
		Register poster grid controller to selector controller
		 */
		var posterGridCtrl = ctrl[0],
			selectorCtrl = ctrl[1];
		posterGridCtrl.init(element);
		selectorCtrl.registerGrid(posterGridCtrl);
	};

	return {
		templateUrl: '../views/postergrid.html',
		require: ['posterGrid', '^selector'],
		restrict: 'E',
		controller: 'posterGridCtrl',
		link: link
	};
});
