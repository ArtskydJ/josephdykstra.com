var Linkifier = require('noddity-linkifier')
var render = require('noddity-render-static')
var renderData = require('./render-data.json')

module.exports = function renderMarkdown(butler) {
	var renderOpts = {
		butler: butler,
		linkifier: new Linkifier('/'),
		data: renderData
	}

	return function renderPage(filename, cb) {
		render('post-template.html', filename, renderOpts, cb)
	}
}
