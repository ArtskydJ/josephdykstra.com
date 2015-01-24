//Include
var config = require('./config.json').ftp
var auth = require('./auth.json')
var ftpd = require('ftpd')
var path = require('path')
var gfs = require('graceful-fs')

//Settings
var PORT = process.argv[2] || config.port || 21
var options = {
	pasvPortRangeStart: 1024,
	pasvPortRangeEnd: 8095,
	getInitialCwd: function () {return '' },
	getRoot: function () { return config.dir }
}

function onConnect(connection) {
	var username = null
	console.log('client connected: ' + connection.socket.remoteAddress)

	connection.on('command:user', function (user, success, failure) {
		username = user
		auth[username] ? success() : failure()
	})

	connection.on('command:pass', function (pass, success, failure) {
		(auth[username] === pass) ? success(username, gfs) : failure()
	})

}

//Server
var server = new ftpd.FtpServer(config.host, options)
server.listen(PORT)
server.on('error', function (error) {
	console.log('FTP Server error:', error)
})
server.on('client:connected', onConnect)
