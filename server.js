var http = require('http')
var send = require('send')
var config = require('./serverConfig.json')
var PORT = process.env.PORT || config.port || 80

http.createServer(function (req, res) {
	config.verbose && console.log('accessing:', req.url)
	send(req, req.url, config.send).pipe(res)
}).listen(PORT).on('error', function (err) {
	if (err.code == 'EADDRINUSE') {
		console.log('Address in use, retrying...');
		setTimeout(function () {
			try { server.close() } catch (e) { console.error(e) }
			server.listen(PORT);
		}, 1000);
	}
})
