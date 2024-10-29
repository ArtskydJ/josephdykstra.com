var fs = require('fs')
var path = require('path')
var config = require('../config.json')

module.exports = function writeFile(htmlContentStatic, filename, content) {
	const dir = {
		html: config.relativeGeneratorToHtmlPath,
		content: config.relativeGeneratorToContentPath,
		static: config.relativeGeneratorToStaticPath,
	}[htmlContentStatic]
	if (!dir) {
		throw new Error('Pass "html" or "content" or "static" into the first argument of writeFile')
	}
	var outputPath = path.join(__dirname, '..', dir, filename)
	fs.writeFileSync(outputPath, content)
	console.log('Writing: ' + filename)
}
