//Include
var auth = require('./ftp-auth.json')
var config = require('./ftp-config.json')
var ftpd = require('ftpd')
var path = require('path')
var gfs = require('graceful-fs')

//Settings
var options = {
	pasvPortRangeStart: 1024,
	pasvPortRangeEnd: 8095,
	getInitialCwd: function () { return '' },
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
function Server() {
	var server = new ftpd.FtpServer(config.host, options)
	server.on('client:connected', onConnect)
	return server
}

//Instance
var server = Server()
server.listen(config.port)
server.on('error', function (error) {
	console.error('FTP Server error:', error)
})
