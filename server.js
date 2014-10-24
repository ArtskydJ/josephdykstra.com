var http = require('http')
var send = require('send')
var config = require('./serverConfig.json')
var PORT = process.env.PORT || config.port || 80

http
	.createServer()
	.listen(PORT)
	.on('request', function (req, res) {
		config.verbose && console.log('accessing:', req.url)
		send(req, req.url, config.send).pipe(res)
	})
	.on('error', function (err) {
		if (err.code == 'EADDRINUSE') console.log('Close the server running on port '+PORT+' and try again.')
		else console.dir(err)
	})
