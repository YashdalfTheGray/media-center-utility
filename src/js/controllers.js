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
		'$scope', 'uTorrentService', 'dataService',
		function($scope, uTorrentService, dataService){
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
				dataService.sendFileListing(file, function(data){
					console.log('Sent filelisting data POST, reply was: ' + data);
				},
				function(data, status, header, config) {
					console.log('Something went wrong!');
					console.log(data);
				});
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
		'$scope', '$window', 'dataService', 'appSettings',
		function($scope, $window, dataService, appSettings){
			$scope.plexPath = '';
			$scope.server = {
				canSend: false,
				email: '',
				password: ''
			};

			$scope.$on('$routeChangeSuccess', function() {
				dataService.getServerData(function(data) {
					$scope.server = data;
				},
				function(data, status, header, config) {
					console.log('Something went wrong!');
					console.log(data);
				});
				dataService.getPlexPath(function(data) {
					$scope.plexPath = data.path;
				},
				function(data, status, header, config) {
					console.log('Something went wrong!');
					console.log(data);
				});
			});

			$scope.isEmpty = function(string) {
				console.log('Called with ' + string);
				return (string === '');
			};
			$scope.externalClick = function(url) {
				$window.open(url, '_blank');
			};
			$scope.refreshPlex = function() {
				dataService.refreshPlex(function(data) {
					console.log('Sent refresh plex GET, reply was: ' + data);
				},
				function(data, status, header, config) {
					console.log('Something went wrong!');
					console.log(data);
				});
			};
			$scope.updateEmailSettings = function() {
				dataService.sendServerData($scope.server, function(data) {
					console.log('Sent email data POST, reply was: ' + data);
				},
				function(data, status, header, config) {
					console.log('Something went wrong!');
					console.log(data);
				});
			};
			$scope.updatePlexSettings = function() {
				dataService.sendPlexPath($scope.plexPath, function(data) {
					console.log('Sent plex path POST, reply was: ' + data);
				},
				function(data, status, header, config) {
					console.log('Something went wrong!');
					console.log(data);
				});
			};
		}
	]
);