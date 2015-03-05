// To run in full debug mode, use set DEBUG=express:* & node server/server.js
// on Windows or DEBUG=express:* node server/server.js on unix

var express = require('express');
var morgan = require('morgan');
var path = require('path');
var colors = require('colors');


var app = express();

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
	console.log('Details: ' + colors.yellow('{name: ' + req.query.name + ', directory: ' + req.query.directory + '}'));
	res.sendStatus(200);
});

app.listen(app.get('port'), function() {
	console.log('media-center-utility app listening on port ' + colors.green(app.get('port')));
});