var path = require('path')
var uncss = require('uncss')
var cleanCss = require('clean-css')
var config = require('./config.json')
var writeDestinationFileSync = require('./write-dest-file-sync.js')
var noddityIndexPath = path.resolve(config.relativeGeneratorToContentPath, 'index.json')
var noddityIndexJson = require(noddityIndexPath)

var htmlFiles = noddityIndexJson.map(function (markdownFilename) {
	return config.relativeGeneratorToHtmlPath + markdownFilename.replace('.md', '.html')
})

var stylesheets = [
	'cosmo.css',
	'my-styles.css'
].map(function (cssFilename) {
	return config.relativeHtmlToCssPath + cssFilename
})

uncss(htmlFiles, {
	stylesheets: stylesheets
}, function (err, css) {
	if (err) throw err

	var minifiedCss = new cleanCss().minify(css).styles
	writeDestinationFileSync('bootstrap.min.css', minifiedCss)
})
