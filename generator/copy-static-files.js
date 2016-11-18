var fs = require('fs')
var path = require('path')
var dive = require('dive')
var config = require('./config.json')

var noddityIndexPath = path.resolve(config.relativeGeneratorToContentPath, 'index.json')
var noddityIndexJson = require(noddityIndexPath)
var exclude = noddityIndexJson.concat([ 'index.md', 'index.json', 'post-template.html' ])

var fullContentPath = path.join(__dirname, config.relativeGeneratorToContentPath)

dive(config.relativeGeneratorToContentPath, function (err, filePath) {
	if (err) throw err
	var contentRelativePath = filePath.replace(fullContentPath, '')
	if (!exclude.includes(contentRelativePath)) {
		var newFilePath = path.join(__dirname, config.relativeGeneratorToHtmlPath, contentRelativePath)
		fs.createReadStream(filePath)
			.pipe(fs.createWriteStream(newFilePath))
	}
})
