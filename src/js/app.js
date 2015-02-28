/* global angular */

angular.module('mediaCenter', 
	[
		'ngRoute',
		'mediaCenter.controllers',
		'mediaCenter.services'
	]
)
.config([
	'$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/main', {
				templateUrl: 'partials/main.html',
				controller: 'main'
			})
			.otherwise({ redirectTo: '/main'})
	}
]);