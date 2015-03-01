/* global angular */

angular.module('mediaCenter.controllers', [])
.controller('main', 
	[
		'$scope', 
		function($scope) {
			$scope.appName = 'Media Center';
		}
	]
)
.controller('navigation',
	[
		'$scope', '$window', 'appSettings',
		function($scope, $window, appSettings) {
			$scope.externalClick = function() {
				$window.open(appSettings.utorrentUrl, '_blank');
			}
		}
	]
)