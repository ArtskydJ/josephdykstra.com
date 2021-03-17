var path = require('path')
var copy = require('recursive-copy')
var config = require('./config.json')

var src = path.join(__dirname, config.relativeGeneratorToStaticPath)
var dest = path.join(__dirname, config.relativeGeneratorToHtmlPath)
var everythingExceptMarkdown = {
	filter: [ '**', '!**/*.md', '!resume-pdf.html']
}

module.exports = copy(src, dest, everythingExceptMarkdown) // returns a promise
