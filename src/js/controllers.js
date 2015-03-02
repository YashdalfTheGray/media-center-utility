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
			};
		}
	]
)
.controller('files', 
	[
		'$scope', 
		function($scope){
			$scope.appName = 'Media Center';	
		}
	]
)
.controller('settings', 
	[
		'$scope', '$window', 'appSettings',
		function($scope, $window, appSettings){
			$scope.emailAddress = '';
			$scope.password = '';
			$scope.externalClick = function(url) {
				$window.open(url, '_blank');
			};
			$scope.updateEmailSettings = function() {
				appSettings.serverEmail = $scope.emailAddress;
				appSettings.serverpassword = $scope.password;
				console.log(appSettings.serverEmail);
				console.log(appSettings.serverpassword);
			};
		}
	]
);