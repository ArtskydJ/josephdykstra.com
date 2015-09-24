//Include
var http = require('http')
var Ecstatic = require('ecstatic')
var url = require('url')
var viewModel = require('./view-model.js')()

var DIR = __dirname + '/web/'
var PORT = process.argv[2] || 80

var serveAssets = Ecstatic({
	root: DIR,
	autoIndex: false,
	handleError: false,
	gzip: true // needs .gz files
})

var server = http.createServer()
server.listen(PORT)
server.on('error', function (err) {
	(err.code == 'EADDRINUSE') ?
		console.log('A server is already running on '+PORT+'.') :
		console.error('HTTP Server error:', err)
})

function renderPage(filename, res, statusCode, onFail) {
	viewModel(filename, function (err, html) {
		if (!err) {
			res.writeHead(statusCode)
			res.end(html, 'utf8')
		} else if (typeof onFail === 'function') {
			onFail()
		} else {
			res.writeHead(500)
			res.end(err ? err.message : 'An unknown error occurred', 'utf8')
		}
	})
}

server.on('request', function route(req, res) {
	var path = url.parse(req.url).pathname.slice(1) || 'index'

	renderPage(path, res, 200, function fail1() {
		serveAssets(req, res, function fail2 () {
			renderPage('404', res, 404)
		})
	})
})
