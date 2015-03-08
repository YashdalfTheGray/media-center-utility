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
		'$scope', 'uTorrentService',
		function($scope, uTorrentService){
			$scope.debug = true;
			$scope.filesInProgress = 
			[
				{
					name: 'a file.xlsx'
				},
				{
					name: 'another file.txt'
				},
				{
					name: 'a torremt file.torrent'
				},
				{
					name: 'how about a movie.mov'
				}
			];
			$scope.addNotifier = function(file) {
				console.log('file: {name: ' + file.name + ', notifyEmail: ' + file.notifyEmail + '}');
			};

			uTorrentService.getTorrentList(function(data) {
				$scope.testData = data;
			},
			function(data, status, header, config) {
				console.log('Something went wrong!');
				console.log(data);

			});
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
			$scope.refreshPlex = function() {
				console.log('refreshing Plex Media Server!');
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