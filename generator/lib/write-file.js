var fs = require('fs')
var path = require('path')

module.exports = function writeFile(dir, filename, content) {
	var outputPath = path.join(dir, filename)
	fs.writeFileSync(outputPath, content)
	console.log('Writing: ' + filename)
}
