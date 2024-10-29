var path = require('path')
var copy = require('recursive-copy')
var config = require('./config.json')

var src = path.join(__dirname, config.relativeGeneratorToStaticPath)
var dest = path.join(__dirname, config.relativeGeneratorToHtmlPath)

module.exports = copy(src, dest, {
	filter: [
		'**',
		'!**/*.md',
		'!resume-pdf.html',
		'!*.json',
	]
}) // returns a promise
