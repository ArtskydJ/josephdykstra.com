var Level = require('level-mem')
var Butler = require('noddity-butler')
var Linkifier = require('noddity-linkifier')
var renderStatic = require('noddity-render-static')

var FEED_ROOT_POST = {
	filename: '',
	content: '{{>current}}',
	metadata: { markdown: false }
}

module.exports = function () {
	var butler = new Butler('https://raw.githubusercontent.com/ArtskydJ/josephdykstra.com/content/', new Level())

	function render(root, filename, cb) {
		renderStatic(root, filename, {
			butler: butler,
			linkifier: new Linkifier('/'),
			data: {
				editLink: 'https://github.com/ArtskydJ/josephdykstra.com/edit/content/',
				logo: '/logo.png',
				errorPage: '404.md'
			}
		}, cb)
	}

	return {
		getPosts: butler.getPosts,
		renderHtml: render.bind(null, 'post-template.html'),
		renderFeed: render.bind(null, FEED_ROOT_POST)
	}
}
