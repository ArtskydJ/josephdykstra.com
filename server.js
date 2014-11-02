var http = require('http')
var Static = require('node-static')
var config = require('./serverConfig.json')
var PORT = process.env.PORT || config.port || 80

var fileServer = new Static.Server(config.staticDir, {gzip: true})

http.createServer(function (req, res) {
	config.verbose && console.log('accessing:', req.url)
	if (req.url.lastIndexOf('/') === req.url.length-1) {
		req.url += "index.html"
	}
	fileServer.serveFile(req.url, 200, {}, req, res).on('error', function (err) {
		res.writeHead((err && err.status) || 500, err.headers)
		res.end(err.message)
	})
}).listen(PORT).on('error', function (err) {
	if (err.code == 'EADDRINUSE') console.log('Close the server running on port '+PORT+' and try again.')
	else console.dir(err)
})
