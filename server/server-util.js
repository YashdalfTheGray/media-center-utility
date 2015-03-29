// Server Helper methods
exports.findNotifierForFile = function(filename, fileList, remove) {
	remove = typeof remove !== 'undefined' ? remove : true;
	var returnVal = {found: false, file: {}};
	for (var i = 0; i < fileList.length; i++) {
		if (filename === fileList[i].name) {
			returnVal.found = true;
			returnVal.file = remove ? (fileList.splice(i, 1))[0] : fileList[i];
			break;
		}
	}
	return returnVal;
};

exports.updateFileListing = function(file, fileList) {
	var index = -1;
	for (var i = 0; i < fileList.length; i++) {
		if (file.name === fileList[i].name) {
			index = i;
			break;
		}
	}
	if (index < 0) {
		fileList.push(file);
	}
	else {
		fileList[index].notifyEmail = file.notifyEmail;
	}
};

exports.saveToDatastore = function(key, value, datastore, logOnlyErrors) {
	datastore.save(
	{
		key: key,
		_id: key,
		jsonStr: JSON.stringify(value)
	}, 
	function(err, doc) {
		if (err) {
			console.log(err);
		}
		else if (!logOnlyErrors) {
			console.log('Document with key ' + doc.key + ' stored.');
		}
	});
};