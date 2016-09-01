var fs = require('fs')
var path = require('path')
var config = require('./config.json')

module.exports = function writeDestinationFileSync(filename, data) {
	var filePath = path.resolve(__dirname, config.relativeGeneratorToHtmlPath, filename)
	return fs.writeFileSync(filePath, data)
}
