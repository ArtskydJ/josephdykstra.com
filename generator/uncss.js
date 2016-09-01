var path = require('path')
var glob = require('glob')
var uncss = require('uncss')
var cleanCss = require('clean-css')
var config = require('./config.js')
var writeDestinationFileSync = require('./write-dest-file-sync.js')

var htmlFiles = glob.sync('*.html', {
	cwd: config.destinationPath
}).map(function (filename) {
	// uncss doesn't seem to like local files.
	return 'http://josephdykstra.com/' + filename
})

uncss(htmlFiles, {
	stylesheets: [
		resolveCssPath('cosmo.css'),
		resolveCssPath('my-styles.css')
	]
}, function (err, css) {
	if (err) throw err

	var minifiedCss = new cleanCss().minify(css).styles
	writeDestinationFileSync('bootstrap.min.css', minifiedCss)
})

function resolveCssPath(filename) {
	return path.resolve(config.cssPath, filename)
}
