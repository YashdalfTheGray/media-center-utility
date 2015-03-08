// To run in full debug mode, use set DEBUG=express:* & node server/server.js
// on Windows or DEBUG=express:* node server/server.js on unix

var express = require('express'),
	morgan = require('morgan'),
	path = require('path'),
	colors = require('colors'),
	ip = require('ip'),
	utorrent = require('utorrent-api'),
	bodyParser = require('body-parser');

var utorrentUrl = 'http://' + ip.address() + ':9090/gui/latest.html';
var utClient = new utorrent('localhost', '9090');
var serverdeets = { canSend: false, email: '', password: ''};

var app = express();

utClient.setCredentials('admin', 'password');

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

app.set('port', process.argv[2] || 8080);

app.get('/finished', function(req, res) {
	console.log('Torrent job done!');
	console.log('Details: ' + colors.yellow('{name: ' + 
				req.query.name + ', directory: ' + req.query.directory + '}'));
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
	res.status(200).json(serverdeets);
});

app.post('/serverdeets', function(req, res) {
	console.log(req.body);
	serverdeets = req.body;
	res.sendStatus(200);
});

app.listen(app.get('port'), function() {
	console.log('media-center-utility app listening on port ' + colors.green(app.get('port')));
});
