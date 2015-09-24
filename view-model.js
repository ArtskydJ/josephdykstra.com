var fs = require('fs')
var Level = require('level-mem')
var Butler = require('noddity-butler')
var Linkifier = require('noddity-linkifier')
var render = require('noddity-render-static')
var renderData = require('./render-data.json')
var extend = require('xtend')

module.exports = function VModel() {
	var noddityRoot = 'https://raw.githubusercontent.com/ArtskydJ/josephdykstra.com-content/master/'
	var butler = new Butler(noddityRoot, new Level(), {
		refreshEvery: 600000,
		cacheCheckIntervalMs: 10000
	})
	var postTemplate = null
	butler.getPost('post-template.html', function (err, post) {
		if (err) throw err
		postTemplate = post
	})
	return function (filename, cb) {
		var renderOpts = {
			butler: butler,
			linkifier: Linkifier('/'),
			data: renderData // not both places
		}
		if (filename.indexOf('.') == -1) filename += '.md'

		var post = extend(postTemplate)
		post.metadata = extend(renderData, post.metadata)
		post.content = post.content.replace('{{{html}}}', '::' + filename + '::')

		render(post, renderOpts, cb)
	}
}
