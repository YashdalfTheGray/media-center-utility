// To run in full debug mode, use set DEBUG=express:* & node server/server.js
// on Windows or DEBUG=express:* node server/server.js on unix

var express = require('express');
var morgan = require('morgan');
var path = require('path');
var colors = require('colors');
var ip = require('ip');
var utorrent = require('utorrent-api');

var utorrentUrl = 'http://' + ip.address() + ':9090/gui/latest.html';
var utClient = new utorrent('localhost', '9090');

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

app.listen(app.get('port'), function() {
	console.log('media-center-utility app listening on port ' + colors.green(app.get('port')));
});
