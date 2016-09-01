var Ractive = require('ractive')

module.exports = function () {
	consoleLog = console.log
	console.log = function () {}
	new Ractive()
	console.log = consoleLog
}