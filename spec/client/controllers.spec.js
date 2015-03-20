describe('Controllers', function() {
	var $rootScope, $controller;
	var scope, controller;

	beforeEach(function() {
		module('mediaCenter.controllers');
	});

	describe('main controller', function() {

		beforeEach(inject(function($injector) {
			$rootScope = $injector.get('$rootScope');
			$controller = $injector.get('$controller');

			scope = $rootScope.$new();
			controller = $controller('main', { $scope: scope });
		}));

		it('should exist', function() {
			expect(scope.appName).toBe('Media Center');
		});
	});

	describe('files controller', function() {
		var mockDataService, mockTorrentService;

		beforeEach(inject(function($rootScope, $controller) {
			mockDataService = {
				sendFileListing: function(file, successCb, errorCb) {
					successCb('OK');
				},
				getNotifyEmail: function(fileName, successCb, errorCb) {
					successCb(fileName + '@test.com');
				}
			};
			mockTorrentService = {
				getTorrentList: function(successCb, errorCb) {
					successCb({ files: ['sameple', 'test'] });
				}
			}

			scope = $rootScope.$new();
			controller = $controller('files', { 
				$scope: scope,
				uTorrentService: mockTorrentService,
				dataService: mockDataService
			});

			spyOn(mockDataService, 'sendFileListing');
			spyOn(mockDataService, 'getNotifyEmail');
			spyOn(mockTorrentService, 'getTorrentList');
		}));

		describe('$scope.addNotifier', function() {

			it('should send file list to the service', function() {
				scope.addNotifier({
					name: 'testFile',
					notifyEmail: 'test@test.com'
				});

				expect(mockDataService.sendFileListing).toHaveBeenCalled();
			});
		});

		describe('$scope.$watch file names', function() {

			beforeEach(function() {
				scope.filesInProgress = [];
			});

			it('should get notify emails number-of-files times', function() {
				pending('have to rethink watching the list of files')

				scope.filesInProgress = 
				[
					{
						name: 'a file.xlsx'
					},
					{
						name: 'another file.txt'
					}
				];

				scope.$digest();

				expect(mockDataService.getNotifyEmail).calls.count().toBe(filesInProgress.length);
				expect(filesInProgress[0].notifyEmail).toBe(filesInProgress[0].name + '@test.com');
			});
		});

		describe('$scope.$on view load', function() {

			it('should call the get torrent service', function() {
				scope.$broadcast('$routeChangeSuccess');

				expect(mockTorrentService.getTorrentList).toHaveBeenCalled();
			});

		});
	});

});