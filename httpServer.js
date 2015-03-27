//Include
var http = require('http')
var St = require('st')
var url = require('url')
var config = require('./config.json').http

//Settings
var PORT = process.env.PORT || process.argv[2] || config.port || 80
var serveFile = St({
	path: config.dir,
	passthrough: true,
	index: 'index.html',
	//cache: false, // Development only!
	gzip: true
})

//Noddity
var viewModel = (function () {
	var Level = require('level-mem')
	var Retrieval = require('noddity-fs-retrieval')
	var Butler = require('noddity-butler')
	var Renderer = require('noddity-renderer')
	var ViewModel = require('noddity-view-model')
	var renderData = require('./renderData.json')
	var renderTemplate = require('fs').readFileSync(config.dir + 'index.html', {encoding:'utf8'})

	var db = new Level('./database')
	var retrieve = new Retrieval(config.noddity.root)
	var butler = new Butler(retrieve, db, config.noddity.butler)
	var renderer = new Renderer(butler, String)
	return new ViewModel(butler, renderer, renderTemplate, renderData)
})()

function renderPage(path, res, onFail) {
	viewModel(path, function (err, html) {
		if (!err) {
			res.writeHead(200)
			res.end(html, 'utf8')
		} else {
			onFail && onFail()
		}
	})
}

//Routing
function route(req, res) {
	var path = url.parse(req.url).pathname.slice(1) || 'index'
	renderPage(path, res, function fail1() {
		serveFile(req, res, function fail2 () {
			renderPage('404', res, function fail3() {
				res.writeHead(500)
				res.end(err.message, 'utf8')
			})
		})
	})
}

//Server
var server = http.createServer(route)
server.listen(PORT)
server.on('error', function (err) {
	(err.code == 'EADDRINUSE') ?
		console.log('A server is already running on '+PORT+'.') :
		console.dir('HTTP Server error:', err)
})
