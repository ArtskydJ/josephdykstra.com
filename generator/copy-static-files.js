var fs = require('fs')
var path = require('path')
var dive = require('dive')
var config = require('./config.json')

var fullContentPath = path.join(__dirname, config.relativeGeneratorToStaticPath)

dive(config.relativeGeneratorToStaticPath, function (err, filePath) {
	if (err) throw err

	var contentRelativePath = filePath.replace(fullContentPath, '')
	var newFilePath = path.join(__dirname, config.relativeGeneratorToHtmlPath, contentRelativePath)
	fs.createReadStream(filePath)
		.pipe(fs.createWriteStream(newFilePath))
})
