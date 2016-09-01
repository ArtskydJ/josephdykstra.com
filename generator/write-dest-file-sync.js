var fs = require('fs')
var path = require('path')
var config = require('./config.js')

module.exports = function writeDestinationFileSync(filename, data) {
	return fs.writeFileSync(path.resolve(config.destinationPath, filename), data)
}
