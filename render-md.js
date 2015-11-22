var Linkifier = require('noddity-linkifier')
var render = require('noddity-render-static')
var renderData = require('./render-data.json')

module.exports = function renderMarkdown(butler) {
	var renderOpts = {
		butler: butler,
		linkifier: new Linkifier('/'),
		data: renderData
	}

	return function renderPage(root, filename, cb) {
		render(root, filename, renderOpts, cb)
	}
}
