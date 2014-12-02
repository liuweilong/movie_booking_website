'use strict';

/**
 * @ngdoc service
 * @name gvApp.movieData
 * @description
 * # movieData
 * Service in the gvApp.
 */
angular.module('gvApp')
.service('movieData', 
	function () {
		this.posters = [
			'1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'
		];
});
