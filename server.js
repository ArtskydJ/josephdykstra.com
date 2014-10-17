var http = require('http')
var send = require('send')
var config = require('./serverConfig.json')

function listener(req, res) {
	send(req, req.url, config.send).pipe(res)
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
