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
	dataStore = require('docstore'),
	serverUtil = require('./server-util.js'),
	fileUtil = require('./file-util.js');

var utorrentUrl = 'http://' + ip.address() + ':9090/gui/latest.html';
var serverdeets = { canSend: false, email: '', password: ''};
var fileList = [];
var plexdeets = { path: '', libMovies: '', libTvShows: '' };
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


// Express - app.get() calls
app.get('/finished', function(req, res) {
	console.log('Torrent job done!');
	console.log('Details: ' + colors.yellow('{name: ' + 
				req.query.name + ', directory: ' + req.query.directory + '}'));

	var fileNotifier = serverUtil.findNotifierForFile(req.query.name, fileList);

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
			res.status(200).json(plexdeets);
		}
		else {
			res.status(200).json(JSON.parse(doc.jsonStr));
		}
	});
});
app.get('/filenotifier', function(req, res) {
	var fileNotifier = serverUtil.findNotifierForFile(req.query.file, fileList, false);
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
	serverUtil.saveToDatastore('serverdeets', req.body, db);
	serverdeets = req.body;
	res.sendStatus(200);
});
app.post('/filelisting', function(req, res) {
	console.log(req.body);
	serverUtil.updateFileListing(req.body, fileList);
	res.sendStatus(200);
});

app.post('/plexdeets', function(req, res) {
	serverUtil.saveToDatastore('plexdeets', req.body, db);
	plexdeets = req.body;
	res.sendStatus(200);
});


// Express - app.listen() call
app.listen(process.argv[2] || 8080);
