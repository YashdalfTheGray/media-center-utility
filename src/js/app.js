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
			}).
			when('/files', {
				templateUrl: 'partials/files.html',
				controller: 'files'
			})
			.when('/settings', {
				templateUrl: 'partials/settings.html',
				controller: 'settings'
			})
			.otherwise({ redirectTo: '/main'});
	}
]);