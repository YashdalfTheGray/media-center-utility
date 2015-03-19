server = require('./../../server/server.js')

describe('file listing', function() {
	var fileList, file;

	beforeEach(function() {
		fileList = [];
		file = {};
	})

	it('should add file to file list if not found', function() {
		fileList = [];
		file = {name: 'test', notifyEmail: 'test@test.com'};

		server.updateFileListing(file, fileList);

		expect(fileList.length).toBe(1);
		expect(fileList[0].name).toBe('test');
		expect(fileList[0].notifyEmail).toBe('test@test.com');
	});

	it('should modify file when file is found', function() {
		fileList = [ { name: 'test', notifyEmail: 'test@test.com'} ];
		file = {name: 'test', notifyEmail: 'testerson@test.com'};

		server.updateFileListing(file, fileList);

		expect(fileList.length).toBe(1);
		expect(fileList[0].name).toBe('test');
		expect(fileList[0].notifyEmail).toBe('testerson@test.com');
	});

	it('should add notifyEmail property when it is not there', function() {
		fileList = [ { name: 'test' } ];
		file = {name: 'test', notifyEmail: 'testerson@test.com'};

		server.updateFileListing(file, fileList);

		expect(fileList.length).toBe(1);
		expect(fileList[0].name).toBe('test');
		expect(fileList[0].notifyEmail).toBeDefined();
		expect(fileList[0].notifyEmail).toBe('testerson@test.com');
	});

	it('should not do anything when inserting a duplicate', function() {
		fileList = [ { name: 'test', notifyEmail: 'test@test.com'} ];
		file = {name: 'test', notifyEmail: 'test@test.com'};

		server.updateFileListing(file, fileList);

		expect(fileList.length).toBe(1);
		expect(fileList[0].name).toBe('test');
		expect(fileList[0].notifyEmail).toBe('test@test.com');
	})

	it('should add a new file to the list', function() {
		fileList = [ { name: 'test', notifyEmail: 'test@test.com'} ];
		file = {name: 'another test', notifyEmail: 'testerson@test.com'};

		server.updateFileListing(file, fileList);

		expect(fileList.length).toBe(2);
		expect(fileList[0].name).toBe('test');
		expect(fileList[0].notifyEmail).toBe('test@test.com');
		expect(fileList[1].name).toBe('another test');
		expect(fileList[1].notifyEmail).toBe('testerson@test.com');
	})

});

describe('file notifier finder', function() {
	var fileList, fileName, remove, fileNotifier;

	beforeEach(function() {
		fileList = [];
		fileName = '';
		remove = false;
		fileNotifier = {};
	});

	it('should return false when the file is not found', function() {
		fileList = [ { name: 'test', notifyEmail: 'test@test.com'} ];
		fileName = 'not test';
		
		fileNotifier = server.findNotifierForFile(fileName, fileList, remove);

		expect(fileNotifier.found).toBe(false);
		expect(fileNotifier.file).toEqual({});
		expect(fileList.length).toBe(1);
	});

	it('should find the notifier when it exists', function() {
		fileList = [ { name: 'test', notifyEmail: 'test@test.com'} ];
		fileName = 'test';
		
		fileNotifier = server.findNotifierForFile(fileName, fileList, remove);

		expect(fileNotifier.found).toBe(true);
		expect(fileNotifier.file.name).toBe(fileName);
		expect(fileList.length).toBe(1);
	});

	it('should remove the notifier when it exists and asked to remove it', function() {
		fileList = [ { name: 'test', notifyEmail: 'test@test.com'} ];
		fileName = 'test';
		remove = true;
		
		fileNotifier = server.findNotifierForFile(fileName, fileList, remove);

		expect(fileNotifier.found).toBe(true);
		expect(fileNotifier.file.name).toBe(fileName);
		expect(fileList.length).toBe(0);
	});

	it('should remove the notifier when no remove argument is passed in', function() {
		fileList = [ { name: 'test', notifyEmail: 'test@test.com'} ];
		fileName = 'test';
		
		fileNotifier = server.findNotifierForFile(fileName, fileList);

		expect(fileNotifier.found).toBe(true);
		expect(fileNotifier.file.name).toBe(fileName);
		expect(fileList.length).toBe(0);
	});
});

describe('datastore saver', function() {
	var key, value, mockDb;

	beforeEach(function() {
		key = '';
		value = {};
		consoleText = '';
		mockDb = {
			get: function(key, callback) {
				if (key === 'undefined') {
					callback({err: 'file not found'});
				}
				else if (key === 'defined') {
					callback(null, {key: 'defined', _id: 'defined', jsonStr: 'test json string'});
				}
			},
			save: function(objectToSave, callback) {
				if (typeof objectToSave.key === 'undefined' || 
					typeof objectToSave._id === 'undefined' || 
					typeof objectToSave.jsonStr === 'undefined') {
					callback({err: 'objectToSave missing information, cannot save'});
				}
				else {
					callback(null, {key: objectToSave.key});
				}
			}
		};

		spyOn(mockDb, 'save').and.callThrough();
	});

	

	it('pending tests', function() {
		pending('to test future additions to the code');
	});
});