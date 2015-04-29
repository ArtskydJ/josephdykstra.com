//Include
var http = require('http')
var St = require('st')
var url = require('url')

//Constants
var DIR = './web/'
var PORT = process.argv[2] || 80

//Static File Server
var defaultStatic = St({
	path: DIR,
	passthrough: true,
	index: 'index.html',
	//cache: false,
	gzip: true
})

//Noddity
var viewModel = require('./view-model.js')(DIR + 'index.html')

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

function errorResponse(errorString) {
	if (!errorString) errorString = 'An unknown error occurred.'
	return function failure(err) {
		res.writeHead(500)
		res.end(err ? err.message : errorString, 'utf8')
	}
}

//Routing
function route(req, res) {
	var path = url.parse(req.url).pathname.slice(1) || 'index'
	renderPage(path, res, function fail1() {
		defaultStatic(req, res, function fail2 () {
			renderPage('404', res, errorResponse('failed to generate page'))
		})
	})
}

//Server
var server = http.createServer(route)
server.listen(PORT)
server.on('error', function (err) {
	(err.code == 'EADDRINUSE') ?
		console.log('A server is already running on '+PORT+'.') :
		console.error('HTTP Server error:', err)
})
