var http = require('http')
var handle = require('./request-handler.js')

var PORT = Number(process.argv[2]) || 80

var server = http.createServer(handle)

server.listen(PORT)

server.on('error', function (err) {
	if (err.code === 'EADDRINUSE') {
		console.log('A server is already running on ' + PORT)
	} else {
		console.error('HTTP Server error:', err)
	}
})

module.exports = server.close.bind(server)
