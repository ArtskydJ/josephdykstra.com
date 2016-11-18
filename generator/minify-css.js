var fs = require('fs')
var path = require('path')
var uncss = require('uncss')
var cleanCss = require('clean-css')
var config = require('./config.json')
var noddityIndexPath = path.resolve(config.relativeGeneratorToContentPath, 'index.json')
var noddityIndexJson = require(noddityIndexPath).concat('index.md')
var cssDir = path.join(__dirname, config.relativeGeneratorToCssPath)
var htmlDir = config.relativeGeneratorToHtmlPath

var htmlFiles = noddityIndexJson.map(function (markdownFilename) {
	return path.join(htmlDir, markdownFilename.replace(/.md$/, '.html'))
})

var stylesheets = fs.readdirSync(cssDir).map(function (cssFilename) {
	return path.join(config.relativeHtmlToCssPath, cssFilename)
})

uncss(htmlFiles, {
	stylesheets: stylesheets
}, function (err, css) {
	if (err) throw err

	var minifiedCss = new cleanCss().minify(css).styles
	fs.writeFile(path.join(htmlDir, 'bootstrap.min.css'), minifiedCss)
})
