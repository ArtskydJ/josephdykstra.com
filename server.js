//Include
var http = require('http')
var Static = require('node-static')
var url = require('url')
var config = require('./config.json')


//Settings
var PORT = process.env.PORT || config.port || 80
var fileServer = new Static.Server(config.staticDir, {gzip: true})

//Noddity
var model = (function () {
	var level = require('level')
	var Sublevel = require('level-sublevel')
	var Retrieval = require('noddity-fs-retrieval')
	var Butler = require('noddity-butler')
	var Renderer = require('noddity-renderer')
	var Model = require('./model.js')
	var modelData = require('./noddityConfig.json')
	var modelTemplate = require('fs').readFileSync('./index.html', {encoding:'utf8'})

	var db = Sublevel(level('./database'))
	var normalizedSublevelName = modelData.title.replace(/[^\w]+/g, '')
	var retrieve = new Retrieval(modelData.noddityRoot)
	var butler = new Butler(retrieve, db.sublevel(normalizedSublevelName))
	var renderer = new Renderer(butler, String)
	return new Model(modelTemplate, modelData, butler, renderer)
})()

//Routing
function serveFile(req, res) {
	//console.log('default', req.url)
	fileServer
		.serveFile(req.url, 200, {}, req, res)
		.on('error', function () {
			model.setCurrent('404.md', function (err, html) {
				res.writeHead(err? 500 : 404)
				res.end(html, 'utf8')
			})
		})
}

function route(req, res) {
	var path = url.parse(req.url).pathname.slice(1) || 'index'
	model.setCurrent(path + '.md', function (err, html) {
		if (err) {
			serveFile(req, res)
		} else {
			//console.log('page:', path)
			res.writeHead(200)
			res.end(html, 'utf8')
		}
	})
}

//Server
var server = http.createServer(route).listen(PORT).on('error', function (err) {
	if (err.code == 'EADDRINUSE') console.log('Close the server running on port '+PORT+' and try again.')
	else console.dir("server err:", err)
})
