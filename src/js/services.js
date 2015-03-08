/* global angular */

angular.module('mediaCenter.services', [])
.constant('appSettings', 
	{
		'utorrentUrl': 'http://localhost:9090/gui/latest.html'
	}
)
.factory(
	'uTorrentService', 
	[
		'$http',
		function($http) {
			return {
				getTorrentList: function(successCb, errorCb) {
					$http.get('http://localhost:8080/utorrentlist')
					.success(successCb)
					.error(errorCb);
				}
			};
		}
	]
);