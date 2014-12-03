'use strict';

/**
 * @ngdoc service
 * @name gvApp.movieData
 * @description
 * # movieData
 * Service in the gvApp.
 */
angular.module('gvApp')
.service('movieData', ['$http',
	function ($http) {
		this.queryData = function() {
			return $http.get('../../rec/data.json')
		};
		
}]);
