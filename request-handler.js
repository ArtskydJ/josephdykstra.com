var Ecstatic = require('ecstatic')
var url = require('url')
var RenderMd = require('./render-md.js')
var ServePage = require('./serve-page.js')
var Feeds = require('./feeds.js')
var Level = require('level-mem')
var Butler = require('noddity-butler')

var DIR = __dirname + '/web/'
var MARKDOWN_FILE_RE = /^(?:(.+)\.md|([^\.]+))$/
var FEED_FILE_RE = /^feed\.(atom|rss)$/

var serveStatic = Ecstatic({
	root: DIR,
	autoIndex: false
})

var butler = new Butler('https://raw.githubusercontent.com/ArtskydJ/josephdykstra.com/content/', new Level())
var render = RenderMd(butler)
var servePage = ServePage(render)
var serveFeed = Feeds(butler, render)

module.exports = function route(req, res) {
	var filename = urlToFilename(req.url)
	if (MARKDOWN_FILE_RE.test(filename)) {
		servePage(filename, res)
	} else if (FEED_FILE_RE.test(filename)) {
		serveFeed(filename, res)
	} else {
		serveStatic(req, res)
	}
}

function urlToFilename(urlStr) {
	var pathname = url.parse(urlStr).pathname
	return pathname.slice(1).replace(MARKDOWN_FILE_RE, '$1$2.md') || 'index.md'
}
