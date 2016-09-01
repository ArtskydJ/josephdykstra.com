var fs = require('fs')
var path = require('path')
var glob = require('glob')
var uncss = require('uncss')
var cleanCss = require('clean-css')

var htmlFiles = glob.sync('*.html', {
	cwd: path.resolve(__dirname, '..')
}).map(function (filename) {
	// uncss doesn't seem to like local files.
	return 'http://josephdykstra.com/' + filename
})

uncss(htmlFiles, {
	stylesheets: [
		path.resolve(__dirname, '..', 'css', 'cosmo.css'),
		path.resolve(__dirname, '..', 'css', 'my-styles.css')
	]
}, function (err, css) {
	if (err) throw err

	var minifiedCss = new cleanCss().minify(css).styles

	var bootstrapPath = path.resolve(__dirname, '..', 'bootstrap.min.css')
	fs.writeFileSync(bootstrapPath, minifiedCss)
})
