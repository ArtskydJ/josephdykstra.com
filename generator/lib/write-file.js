var fs = require('fs')
var path = require('path')

module.exports = function writeFile(dir, filename, content) {
	var outputPath = path.join(dir, filename)
	fs.writeFile(outputPath, content, throwIfErr)
}

function throwIfErr(err) {
	if (err) throw err
}
