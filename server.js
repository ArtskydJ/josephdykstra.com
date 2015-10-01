//Include
var http = require('http')
var Ecstatic = require('ecstatic')
var url = require('url')
var setCurrent = require('./view-model.js')()

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

function renderPage(filename, res, statusCode) {
	setCurrent(filename, function (err, html) {
		if (err) {
			if (statusCode !== 404) { // disallow 404 recursion
				renderPage('404.md', res, 404)
			} else {
				res.writeHead(500)
				res.end(err ? err.message : 'An unknown error occurred', 'utf8')
			}
		} else {
			res.writeHead(statusCode || 200)
			res.end(html, 'utf8')
		}
	})
}

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
