var http = require('http');
var querystring = require('querystring');

var torrentName = querystring.stringify(process.argv[2]);
var directory = querystring.stringify(process.argv[3]);

var url = 'http://127.0.0.1:8080/finished?name=' + process.argv[2] + '&directory=' + process.argv[3];

http.get(url, function(res) {
	console.log('Server responded with ' + res.statusCode);
	process.exit(0);
}).on('error', function(e) {
	console.log('Error: ' + e.message);
});