//Include
var config = require('./config.json').ftp
var auth = require('./auth.json')
var ftpd = require('ftpd')
var path = require('path')

//Settings
var PORT = process.argv[3] || config.port || 21
var PATH = path.join(process.cwd(), config.dir)
var options = {
	pasvPortRangeStart: 4000,
	pasvPortRangeEnd: 5000,
	getInitialCwd: function () {return PATH},
	getRoot: function () { return '/' }
}

function onConnect(connection) {
	var username = null
	console.log('client connected: ' + connection.remoteAddress)

	connection.on('command:user', function (user, success, failure) {
		username = user
		auth[username] ? success() : failure()
	})

	connection.on('command:pass', function (pass, success, failure) {
		(auth[username] === pass) ? success() : failure()
	})

}

//Server
var server = new ftpd.FtpServer(config.host, options)
server.listen(PORT)
server.on('error', function (error) {
	console.log('FTP Server error:', error)
})
server.on('client:connected', onConnect)