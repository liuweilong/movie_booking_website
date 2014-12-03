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
		this.theaters = ["The Cathay", "West Mall", "Cineleisure", "JEM", "Causeway Point", "AMK HUB", "Downtown East"];

		this.queryData = function() {
			return $http.get('../../rec/data.json')
		};
		
}]);
