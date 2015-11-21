//Include
var http = require('http')
var Ecstatic = require('ecstatic')
var url = require('url')
var RenderPage = require('./render-page.js')
var Feeds = require('./feeds.js')
var Level = require('level-mem')
var Butler = require('noddity-butler')

var DIR = __dirname + '/web/'
var PORT = Number(process.argv[2]) || 80
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

var butler = new Butler('https://raw.githubusercontent.com/ArtskydJ/josephdykstra.com/content/', new Level())
var renderPage = RenderPage(butler)
var getFeed = Feeds(butler)

server.on('request', function route(req, res) {
	var filename = urlToFilename(req.url)
	if (MARKDOWN_FILE_RE.test(filename)) {
		renderPage(filename, res)
	} else if (/^feed\.(atom|rss)$/.test(filename)) {
		getFeed(filename, res)
	} else {
		serveAssets(req, res)
	}
})

function urlToFilename(urlStr) {
	var pathname = url.parse(urlStr).pathname
	return pathname.slice(1).replace(MARKDOWN_FILE_RE, '$1$2.md') || 'index.md'
}

module.exports = server.close.bind(server)
