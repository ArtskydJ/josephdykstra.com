//Include
var http = require('http')
var Static = require('node-static')
var serConfig = require('./serverConfig.json')
var fs = require('fs')

var Retrieval = require('noddity-fs-retrieval')
var Butler = require('noddity-butler')
var level = require('level')
var route = require('router')()
var Model = require('./mainViewModel')
var Sublevel = require('level-sublevel')
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
var model = new Model(butler, mainRactiveTemplate)
var ractive = model.mainRactive

/*
var events = ["construct", "config", "init", "render", "complete", "change", "update", "unrender", "teardown", "insert", "detach"]
events.forEach(function (evnt) {
	ractive.on(evnt, console.log('ractive', evnt))
})*/

//Routing
function defaultServe(req, res) {
	console.log('default', req.url)
	fileServer
		.serveFile(req.url, 200, {}, req, res)
		.on('error', function () {
			model.setCurrent('404.md')
		})
}
route.get('/', function (req, res) {
	console.log('empty', req.url)
	model.setCurrent('index.md')
	res.writeHead(200)
	setTimeout(function () {
		res.end(ractive.toHTML(), 'utf8')
	}, 1000)
})
//route.get('/{file}.{ext}', defaultServe)
route.get('/{name}.md', function (req, res) {
	console.log('/{name}', req.params.name)
	model.setCurrent(req.params.name)
	res.writeHead(200)
	setTimeout(function () {
		res.end(ractive.toHTML(), 'utf8')
	}, 1000)
	
})
route.get(defaultServe)

//Server
var server = http.createServer(route).listen(PORT).on('error', function (err) {
	if (err.code == 'EADDRINUSE') console.log('Close the server running on port '+PORT+' and try again.')
	else console.dir("server err:", err)
})
