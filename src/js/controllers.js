/* global angular */

angular.module('mediaCenter.controllers', [])
.controller('main', 
	[
		'$scope', 
		function($scope){
			$scope.appName = 'Media Center';
		}
	]
)