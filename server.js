//Include
var http = require('http')
var Ecstatic = require('ecstatic')
var url = require('url')
var renderPage = require('./render-page.js')()

var DIR = __dirname + '/web/'
var PORT = process.argv[2] || 80
var MARKDOWN_FILE_RE = /^(?:(.+)\.md|([^\.]+))$/

var serveAssets = Ecstatic({
	root: DIR,
	autoIndex: false
})

var server = http.createServer()
server.listen(PORT)
server.on('error', function (err) {
	if (err.code === 'EADDRINUSE') {
		console.log('A server is already running on ' + PORT)
	} else {
		console.error('HTTP Server error:', err)
	}
})

server.on('request', function route(req, res) {
	var filename = urlToFilename(req.url)
	if (MARKDOWN_FILE_RE.test(filename)) {
		renderPage(filename, res)
	} else {
		serveAssets(req, res)
	}
})

function urlToFilename(urlStr) {
	return url.parse(urlStr).pathname
		.slice(1)
		.replace(MARKDOWN_FILE_RE, '$1$2.md')
		|| 'index.md'
}
