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
			// var $expandedItem = posterGridService.$items.eq( this.expandedIdx );
			// $expandedItem.children().css('height', posterGridService.itemHeight[this.expandedIdx]);

		    var self = this,
		        onEndFn = function() {
		            if( posterGridService.support ) {
		                $( this ).off( posterGridService.transEndEventName );
		            }
		            self.$item.removeClass( 'og-expanded' );
		            self.$previewEl.remove();
		        };
		 
		    setTimeout( $.proxy( function() {

		        this.$previewEl.css( 'height', 0 );
		        // the current expanded item (might be different from this.$item)
		        var $expandedItem = posterGridService.$items.eq( this.expandedIdx );
		        $expandedItem.children().css('height', posterGridService.itemHeight[this.expandedIdx]);

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
		this.marginExpanded = 0;
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
			minHeight : 550,
			speed : 325,
			easing : 'ease'
		};
		this.getWinSize = function() {
			// console.log("getting");
			this.winsize = {width: $window.innerWidth, height: $window.innerHeight};
		};

		this.setItems = function(items) {
			if (typeof this.$items === 'undefined') {
				this.$items = items;
				this.saveItemInfo(true);
			};
		}

		this.saveItemInfo = function(saveheight) {
			var self = this;
			this.$items.each(function() {
				var $item = $(this);
				$item.hoverdir({
					hoverDelay: 0,
					inverse: false
				});

				$item.find('.video-link').jqueryVideoLightning({
					autoplay: 1,
					backdrop_color: "#ddd",
					backdrop_opacity: 0.6,
					glow: 20,
					glow_color: "#000"
				});

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

		/*
		Initialization 
		 */
		this.init = function() {
			posterGridService.getWinSize();
		};

		/*
		This is a listener for select events from selector, will be called when a cinema is selected
		 */
		this.select = function(selectedTheater) {
			$scope.selectedTheater = selectedTheater;
		}

		/*
		Determine whether a poster show shold or not. For the function of location filter
		 */
		$scope.show = function(movie) {
			if ($scope.selectedTheater === 'all' | typeof $scope.selectedTheater === 'undefined') {
				return true;
			};
			for (var theater in movie.cinema) {
				// console.log(theater);
				if ($scope.selectedTheater === theater) {
					return true;
				};
			}

			return false;
		}

		$scope.hidePreview = function() {
			$scope.selectorCtrl.expand(false);
			posterGridService.current = -1;
			var preview = $.data( this, 'preview' );
			preview.close();
			$.removeData( this, 'preview' );
		};

		$scope.showPreview = function(item, index, movie) {
			$scope.selectorCtrl.expand(true);
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

		$scope.clickButton = function($event, index, movie) {
			this.index = index;

			var item = angular.element($event.currentTarget).parent().parent().parent().parent().parent();
			console.log(item);
			var items = item.parent().children();
			posterGridService.setItems(items);
			posterGridService.current === index ? $scope.hidePreview() : $scope.showPreview(item, index, movie);
		}

		$scope.togglePreview = function($event, index, movie) {
			this.index = index;

			var item = angular.element($event.currentTarget).parent();
			// console.log(item);
			var items = item.parent().children();

			posterGridService.setItems(items);
			posterGridService.current === index ? $scope.hidePreview() : $scope.showPreview(item, index, movie);
		};

		movieData.queryData().success(function(responce) {
			$scope.movies = responce;
		});

}])

.directive('posterGrid',["$window", function ($window) {
	var fixPosition = function() {
		angular.element("#spacer").css('height', angular.element('.selector').outerHeight() + 'px');
	};

	var pre_link = function(scope, element, attrs, ctrl) {
		
		// Fix the position of content as the header is fixed
		fixPosition();

		/*
		Register poster grid controller to selector controller
		 */
		var posterGridCtrl = ctrl[0],
			selectorCtrl = ctrl[1];
		scope.selectorCtrl = selectorCtrl;
		posterGridCtrl.init();
		selectorCtrl.registerGrid(posterGridCtrl);
	};

	var post_link = function(scope, element, attrs, ctrl) {
	};

	var compile = function(element, attrs) {
		return {
			pre: pre_link,
			post: post_link
		}
	};

	return {
		templateUrl: '../views/postergrid.html',
		require: ['posterGrid', '^selector'],
		restrict: 'E',
		controller: 'posterGridCtrl',
		compile: compile
	};
}]);
