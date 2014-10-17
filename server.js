var http = require('http')
var send = require('send')
var config = require('./config.js')
var sendOptions = config.send

function listener(req, res) {
	send(req, req.url, sendOptions).pipe(res)
}

http.createServer().listen(process.env.PORT || config.port).on('error', function (err) {
	if (err.code == 'EADDRINUSE') {
		console.log('Address in use, retrying...');
		setTimeout(function () {
			try {
				server.close();
			} catch (e) {
				console.error(e)
			} finally {
				server.listen(PORT);
			}
		}, 1000);
	}
})
