//Include
var http = require('http')
var Static = require('node-static')
var fs = require('fs')
var serConfig = require('./serverConfig.json')

var Ractive = require('ractive')
var level = require('level')
var route = require('router')()
var Sublevel = require('level-sublevel')

var Retrieval = require('noddity-fs-retrieval')
var Butler = require('noddity-butler')
var Renderer = require('noddity-renderer')
var nodConfig = require('./noddityConfig.json')

//Settings
var PORT = process.env.PORT || serConfig.port || 80
var fileServer = new Static.Server(serConfig.staticDir, {gzip: true})

//Ractive view or something
var mainRactiveTemplate = fs.readFileSync('./index.html', {encoding:'utf8'})

//Noddity
var db = Sublevel(level('./database'))
var normalizedSublevelName = nodConfig.title.replace(/[^\w]+/g, '')
var retrieve = new Retrieval(nodConfig.noddityRoot)
var butler = new Butler(retrieve, db.sublevel(normalizedSublevelName))
var renderer = new Renderer(butler, function (s) {return s}) //String

//main view model

function changeCurrentPost(butler, key, cb) {
	butler.getPost(key, function(err, post) {
		if (err) {
			//mainRactive.set('html', err.message)
			//titleRactive.set('page', null)
			cb(err)
		} else {
			//titleRactive.set('page', post.metadata.title)
			renderer.renderPost(post, cb)
		}
	})
}

//Routing
function defaultServe(req, res) {
	console.log('default', req.url)
	fileServer
		.serveFile(req.url, 200, {}, req, res)
		.on('error', function () {
			model.setCurrent('404.md', function (err, html) {
				if (!err && html) {
					res.writeHead(404)
					res.end(html, 'utf8')
				} else {
					res.writeHead(500)
					res.end('fail', 'utf8')
				}
			})
		})
}
route.get('/', function (req, res) {
	console.log('empty', req.url)
	model.setCurrent('index.md', function (err, html) {
		if (!err && html) {
			res.writeHead(200)
			res.end(html, 'utf8')
		} else {
			res.writeHead(500)
			res.end('fail', 'utf8')
		}
	})
})
//route.get('/{file}.{ext}', defaultServe)
route.get('/{name}.md', function (req, res) {
	console.log('/{name}', req.params.name)
	model.setCurrent(req.params.name, function (err, html) {
		if (!err && html) {
			res.writeHead(200)
			res.end(html, 'utf8')
		} else {
			res.writeHead(500)
			res.end('fail', 'utf8')
		}
	})
	
})
route.get(defaultServe)

//Server
var server = http.createServer(route).listen(PORT).on('error', function (err) {
	if (err.code == 'EADDRINUSE') console.log('Close the server running on port '+PORT+' and try again.')
	else console.dir("server err:", err)
})
