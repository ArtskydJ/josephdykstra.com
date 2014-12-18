//Include
var http = require('http')
var Static = require('node-static')
var url = require('url')
var config = require('./config.json').http

//Settings
var PORT = process.env.PORT || process.argv[2] || config.port || 80
var fileServer = new Static.Server(config.dir, {gzip: true})

//Noddity
var render = (function () {
	var level = require('level-mem')
	var Sublevel = require('level-sublevel')
	var Retrieval = require('noddity-fs-retrieval')
	var Butler = require('noddity-butler')
	var Renderer = require('noddity-renderer')
	var Render = require('./render.js')
	var renderData = require('./renderData.json')
	var renderTemplate = require('fs').readFileSync(config.dir + 'index.html', {encoding:'utf8'})

	var db = Sublevel(level('./database'))
	var normalizedSublevelName = renderData.title.replace(/[^\w]+/g, '')
	var retrieve = new Retrieval(renderData.noddityRoot)
	var butler = new Butler(retrieve, db.sublevel(normalizedSublevelName), config.butler)
	var renderer = new Renderer(butler, String)
	return new Render(renderTemplate, renderData, butler, renderer)
})()

//File Serving
function serveFile(req, res) {
	fileServer.serveFile(req.url, 200, {}, req, res).on('error', function () {
		render('404', function (err, html) {
			if (err) {
				console.log(err.message)
				res.writeHead(500)
				res.end(err.message, 'utf8')
			} else {
				res.writeHead(404)
				res.end(html, 'utf8')
			}
		})
	})
}

//Routing
function route(req, res) {
	var path = url.parse(req.url).pathname.slice(1) || 'index'
	render(path, function (err, html) {
		if (err) {
			serveFile(req, res)
		} else {
			res.writeHead(200)
			res.end(html, 'utf8')
		}
	})
}

//Server
var server = http.createServer(route)
server.listen(PORT)
server.on('error', function (err) {
	(err.code == 'EADDRINUSE') ?
		console.log('A server is already running on '+PORT+'.') :
		console.dir("HTTP Server error:", err)
})

