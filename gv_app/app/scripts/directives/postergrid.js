'use strict';

/**
 * @ngdoc directive
 * @name gvApp.directive:posterGrid
 * @description
 * # posterGrid
 */
angular.module('gvApp')
.factory('previewFactory', ['posterGridService', function(posterGridService){
	var preview = function(item, index) {
		this.$item = item;
		this.expandedIdx = index;
		this.create();
		this.update();
	};

	preview.prototype = {
		create : function() {
		    // create Preview structure:
		    this.$title = $( '<h3>Title</h3>' );
		    this.$description = $( '<p>Nothing in here</p>' );
		    this.$href = $( '<a href="#">Visit website</a>' );
		    this.$details = $( '<div class="og-details"></div>' ).append( this.$title, this.$description, this.$href );
		    this.$loading = $( '<div class="og-loading"></div>' );
		    this.$fullimage = $( '<div class="og-fullimg"></div>' ).append( this.$loading );
		    this.$closePreview = $( '<span class="og-close"></span>' );
		    this.$previewInner = $( '<div class="og-expander-inner"></div>' ).append( this.$closePreview, this.$fullimage, this.$details );
		    this.$previewEl = $( '<div class="og-expander"></div>' ).append( this.$previewInner );
		    // append preview element to the item
		    this.$item.append( this.getEl() );
		    // set the transitions for the preview and the item
		    if( posterGridService.support ) {
		        this.setTransition();
		    }
		},

		update: function($item) {
			if ($item) {
				this.$item = $item;
			};

			if (posterGridService.current !== -1) {
				var $currentItem = posterGridService.$items.eq(posterGridService.current);
				$currentItem.removeClass('og-expanded');
				this.$item.addClass('og-expanded');
				this.positionPreview();
			};

			posterGridService.current = this.$item.index();
		 
		    var self = this;
		     
		    // remove the current image in the preview
		    if( typeof self.$largeImg != 'undefined' ) {
		        self.$largeImg.remove();
		    }
		 
		    // preload large image and add it to the preview
		    // for smaller screens we don´t display the large image (the last media query will hide the wrapper of the image)
		    if( self.$fullimage.is( ':visible' ) ) {
		        this.$loading.show();
		        $( '<img/>' ).load( function() {
		            self.$loading.hide();
		            self.$largeImg = $( this ).fadeIn( 350 );
		            self.$fullimage.append( self.$largeImg );
		        } ).attr( 'src', posterGridService.path ); 
		    }
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

		setHeights : function() {

			var self = this,
				onEndFn = function() {
					if( posterGridService.support ) {
						self.$item.off( posterGridService.transEndEventName );
					}
					self.$item.addClass( 'og-expanded' );
				};

			this.calcHeight();
			this.$previewEl.css( 'height', this.height );
			this.$item.css( 'height', this.itemHeight ).on( posterGridService.transEndEventName, onEndFn );

			if( !posterGridService.support ) {
				onEndFn.call();
			}

		},
		positionPreview : function() {

			// scroll page
			// case 1 : preview height + item height fits in window´s height
			// case 2 : preview height + item height does not fit in window´s height and preview height is smaller than window´s height
			// case 3 : preview height + item height does not fit in window´s height and preview height is bigger than window´s height
			var position = this.$item.data( 'offsetTop' ),
				previewOffsetT = this.$previewEl.offset().top - posterGridService.scrollExtra,
				scrollVal = this.height + this.$item.data( 'height' ) + posterGridService.marginExpanded <= posterGridService.winsize.height ? position : this.height < posterGridService.winsize.height ? previewOffsetT - ( posterGridService.winsize.height - this.height ) : previewOffsetT;
			
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
		        console.log($expandedItem);
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
		this.posterList = [
			'1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'
		];
		this.itemHeight = [],
		this.itemOffsetTop = [],
		this.support = Modernizr.csstransitions;
		this.current = -1;
		this.previewPos = -1;
		this.scrollExtra = 0;
		this.marginExpanded = 10;
		this.$window = $window;
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
			speed : 350,
			easing : 'ease'
		};
		this.getWinSize = function() {
			console.log("getting");
			this.winsize = {width: $window.innerWidth, height: $window.innerHeight};
		};

		this.setItems = function(items) {
			if (typeof this.$items === 'undefined') {
				this.$items = items;
				console.log(items);
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
					console.log($item.height());
					self.itemHeight.push($item.height());
					$item.data('height', $item.height());
				};
			});
		};
}])

.controller('posterGridCtrl', 
	['$scope', '$attrs', 'posterGridService', 'previewFactory', function($scope, $attrs, posterGridService, previewFactory){
		var self = this;

		this.init = function(element) {
			this.$element = element;
			posterGridService.getWinSize();
			console.log(posterGridService.winsize);
		};

		$scope.hidePreview = function() {
			posterGridService.current = -1;
			var preview = $.data( this, 'preview' );
			preview.close();
			$.removeData( this, 'preview' );
		};

		$scope.showPreview = function(item, index) {
			console.log("showPreview");
			console.log(item);
			var preview = $.data( this, 'preview' ),
				position = item.data('offsetTop');

			console.log($scope.imgNames[index]);
			posterGridService.path = '../rec/' + $scope.imgNames[index];
			posterGridService.scrollExtra = 0;

			if (typeof preview != 'undefined') {
				if (posterGridService.previewPos != position) {
					if (position > posterGridService.previewPos) {
						posterGridService.scrollExtra = preview.height;
					};
					$scope.hidePreview();
				}

				else {
					preview.update(item);
					return false;
				}
			}

			posterGridService.previewPos = position;
			preview = $.data(this, 'preview', new previewFactory(item, index));
			preview.open();
		};

		$scope.togglePreview = function($event, index) {
			var item = angular.element($event.target).parent().parent();
			var items = angular.element($event.target).parent().parent().parent().children();
			posterGridService.setItems(items);
			posterGridService.current === index ? $scope.hidePreview() : $scope.showPreview(item, index);
		};

		$scope.imgNames = posterGridService.posterList;
}])

.directive('posterGrid', function () {
	var link = function(scope, element, attrs, posterGridCtrl) {
		posterGridCtrl.init(element);
	};

	return {
		templateUrl: '../views/postergrid.html',
		restrict: 'E',
		controller: 'posterGridCtrl',
		link: link
	};
});
