var path = require('path')
var copy = require('recursive-copy')
var config = require('./config.json')

var src = path.join(__dirname, config.relativeGeneratorToStaticPath)
var dest = path.join(__dirname, config.relativeGeneratorToHtmlPath)
var opts = {
	filter: [ '**', '!**/*.md' ] // Everything but markdown files
}

copy(src, dest, opts)
