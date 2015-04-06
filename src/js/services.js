/* global angular */

angular.module('mediaCenter.services', [])
.constant('appSettings', 
	{
		'utorrentUrl': 'http://localhost:9090/gui/latest.html',
		'serverUrl': 'http://localhost:8080'
	}
)
.factory(
	'uTorrentService', 
	[
		'$http', 'appSettings',
		function($http, appSettings) {
			return {
				getTorrentList: function(successCb, errorCb) {
					$http.get(appSettings.serverUrl + '/utorrentlist')
					.success(successCb)
					.error(errorCb);
				}
			};
		}
	]
).factory(
	'dataService',
	[
		'$http', 'appSettings', 
		function($http, appSettings) {
			return {
				sendServerData: function(serverObj, successCb, errorCb) {
					$http.post(appSettings.serverUrl + '/serverdeets', serverObj)
					.success(successCb)
					.error(errorCb);
				},
				getServerData: function(successCb, errorCb) {
					$http.get(appSettings.serverUrl + '/serverdeets')
					.success(successCb)
					.error(errorCb);

				},
				sendFileListing: function(fileListing, successCb, errorCb) {
					$http.post(appSettings.serverUrl + '/fileListing', fileListing)
					.success(successCb)
					.error(errorCb);
				},
				getNotifyEmail: function(fileName, successCb, errorCb) {
					$http.get(appSettings.serverUrl + '/filenotifier?file=' + fileName)
					.success(successCb)
					.error(errorCb);
				},
				sendPlexPath: function(plexDetails, successCb, errorCb) {
					$http.post(appSettings.serverUrl + '/plexdeets', plexDetails)
					.success(successCb)
					.error(errorCb);
				},
				getPlexPath: function(successCb, errorCb) {
					$http.get(appSettings.serverUrl + '/plexdeets')
					.success(successCb)
					.error(errorCb);
				},
				refreshPlex: function(successCb, errorCb) {
					$http.get(appSettings.serverUrl + '/refreshplex')
					.success(successCb)
					.error(errorCb);
				}
			};
		}
	]
);