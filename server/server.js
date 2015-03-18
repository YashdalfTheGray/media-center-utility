// To run in full debug mode, use set DEBUG=express:* & node server/server.js
// on Windows or DEBUG=express:* node server/server.js on unix

var express = require('express'),
	morgan = require('morgan'),
	path = require('path'),
	colors = require('colors'),
	ip = require('ip'),
	utorrent = require('utorrent-api'),
	bodyParser = require('body-parser'),
	gmailSender = require('gmail-sender'),
	dataStore = require('docstore');

var utorrentUrl = 'http://' + ip.address() + ':9090/gui/latest.html';
var serverdeets = { canSend: false, email: '', password: ''};
var fileList = [];
var plexPath = '';
var db = {};

var utClient = new utorrent('localhost', '9090');
var app = express();

utClient.setCredentials('admin', 'password');
dataStore.open('./server/datastore', function(err, store) {
	if (err) {
		console.log(err);
	}
	else {
		db = store;
	}
});


// Express - app.use() calls
app.use(morgan(':remote-addr - ' + 
			   '[:date] '.cyan + 
			   '":method :url '.green + 
			   'HTTP/:http-version" '.gray + 
			   ':status '.yellow + 
			   ':res[content-length] ' + 
			   '":referrer" ":user-agent" '.gray + 
			   'time=:response-time ms',
	{
		skip: function(req, res) { return (req.path === '/finished'); }
	}
));
app.use(express.static(path.join(__dirname + '/../src')));
app.use(bodyParser.json());


// Express - app.set() calls
app.set('port', process.argv[2] || 8080);


// Express - app.get() calls
app.get('/finished', function(req, res) {
	console.log('Torrent job done!');
	console.log('Details: ' + colors.yellow('{name: ' + 
				req.query.name + ', directory: ' + req.query.directory + '}'));

	var fileNotifier = findNotifierForFile(req.query.name, fileList);

	if (fileNotifier.found && serverdeets.canSend) {
		gmailSender.send({
			smtp: {
				service: 'Gmail',
				user: serverdeets.email,
				pass: serverdeets.password
			},
			to: {
				email: fileNotifier.file.notifyEmail,
				name: fileNotifier.file.notifyEmail,
				surname: ''
			},
			subject: 'Download done!',
			template: './server/email-template.html',
			data: {
				fileName: fileNotifier.file.name
			}
		});
	}

	res.sendStatus(200);
});
app.get('/utorrentlist', function(req, res) {
	utClient.call('list', function(err, torrentList) {
		if (!err) {
			res.status(200).json(torrentList);
		}
		else {
			res.status(500).json(err);
		}
	});
});
app.get('/serverdeets', function(req, res) {
	db.get('serverdeets', function(err, doc) {
		if (err) {
			res.status(200).json(serverdeets);
		}
		else {
			res.status(200).json(JSON.parse(doc.jsonStr));
		}
	});
});
app.get('/plexdeets', function(req, res) {
	db.get('plexdeets', function(err, doc) {
		if (err) {
			res.status(200).json({
				path: plexPath
			});
		}
		else {
			res.status(200).json({
				path: (JSON.parse(doc.jsonStr)).path
			});
		}
	});
});
app.get('/filenotifier', function(req, res) {
	var fileNotifier = findNotifierForFile(req.query.file, fileList, false);
	console.log(fileList);
	if (fileNotifier.found) {
		res.status(200).send(fileNotifier.file.notifyEmail);
	}
	else {
		res.status(200).end();
	}
});
app.get('/refreshplex', function(req, res) {
	console.log('Refresh Plex here');
});


// Express - app.post() calls
app.post('/serverdeets', function(req, res) {
	saveToDatastore('serverdeets', req.body);
	serverdeets = req.body;
	res.sendStatus(200);
});
app.post('/filelisting', function(req, res) {
	console.log(req.body);
	updateFileListing(req.body, fileList);
	res.sendStatus(200);
});

app.post('/plexdeets', function(req, res) {
	saveToDatastore('plexdeets', req.body);
	plexPath = req.body.path;
	res.sendStatus(200);
});

app.listen(app.get('port'), function() {
	console.log('media-center-utility app listening on port ' + colors.green(app.get('port')));
});


// Private helper methods
var findNotifierForFile = function(filename, fileList, remove) {
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

var updateFileListing = function(file, fileList) {
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

var saveToDatastore = function(key, value) {
	db.get(key, function(err, doc) {
		if (err) {
			db.save(
			{
				key: key,
				_id: key,
				jsonStr: JSON.stringify(value)
			}, 
			function(err, doc) {
				if (err) {
					console.log(err);
				}
				else {
					console.log('Document with key ' + doc.key + ' stored.');
				}
			});

		}
		else {
			if (doc.jsonStr !== JSON.stringify(value)) {
				db.save(
				{
					key: key,
					_id: key,
					jsonStr: JSON.stringify(value)
				}, 
				function(err, doc) {
					if (err) {
						console.log(err);
					}
					else {
						console.log('Document with key ' + doc.key + ' modified.');
					}
				});
			}
		}
	});
};