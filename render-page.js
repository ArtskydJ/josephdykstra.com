var Level = require('level-mem')
var Butler = require('noddity-butler')
var Linkifier = require('noddity-linkifier')
var render = require('noddity-render-static')
var renderData = require('./render-data.json')

module.exports = function VModel() {
	var butler = new Butler('https://raw.githubusercontent.com/ArtskydJ/josephdykstra.com/content/', new Level())
	var renderOpts = {
		butler: butler,
		linkifier: new Linkifier('/'),
		data: renderData
	}

	function renderPage(statusCode, filename, res) {
		render('post-template.html', filename, renderOpts, function (err, html) {
			if (err) {
				if (statusCode === 200) { // disallow 404 recursion
					renderPage(404, '404.md', res)
				} else {
					res.writeHead(500)
					res.end(err ? err.message : 'An unknown error occurred', 'utf8')
				}
			} else {
				res.writeHead(statusCode)
				res.end(html, 'utf8')
			}
		})
	}

	return renderPage.bind(null, 200)
}
