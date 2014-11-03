//Server
//Include
var http = require('http')
var Static = require('node-static')
var serConfig = require('./serverConfig.json')

//Settings
var PORT = process.env.PORT || serConfig.port || 80
var fileServer = new Static.Server(serConfig.staticDir, {gzip: true})
//Noddity

//Server
http.createServer(function (req, res) {
	serConfig.verbose && console.log('accessing:', req.url)
	if (req.url.lastIndexOf('/') === req.url.length-1) {
		req.url += "index.html"
	}
	fileServer.serveFile(req.url, 200, {}, req, res).on('error', function (err) {
		res.writeHead((err && err.status) || 500, err.headers)
		res.end(err.message)
	})
}).listen(PORT).on('error', function (err) {
	if (err.code == 'EADDRINUSE') console.log('Close the server running on port '+PORT+' and try again.')
	else console.dir(err)
})


//Noddity
//Include
var Butler = require('noddity-butler')
var level = require('level')
var routing = require('./noddity/routing')
var Model = require('./noddity/mainViewModel')
var Sublevel = require('level-sublevel')
var nodConfig = require(./noddityConfig.json)

//Settings
var db = Sublevel(level('noddity-content', './database'))
var normalizedSublevelName = nodConfig.title.replace(/[^\w]+/g, '')

//Noddity
var butler = new Butler(nodConfig.noddityRoot, db.sublevel(normalizedSublevelName))
var model = new Model(butler)
var router = routing()
router.on('current', model.setCurrent)
