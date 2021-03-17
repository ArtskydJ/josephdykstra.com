var Level = require('level-mem')
var Butler = require('noddity-butler')
var Retrieval = require('noddity-fs-retrieval')
var Linkifier = require('noddity-linkifier')
var renderStatic = require('noddity-render-static')
var config = require('../config.json')

var FEED_ROOT_POST = {
	filename: '',
	content: '{{>current}}',
	metadata: { markdown: false }
}

module.exports = function () {
	var butler = new Butler(new Retrieval(config.relativeGeneratorToContentPath), new Level())

	function render(root, filename, cb) {
		renderStatic(root, filename, {
			butler: butler,
			linkifier: new Linkifier('/')
		}, cb)
	}

	return {
		getPost: butler.getPost,
		getPosts: butler.getPosts,
		renderHtml: render.bind(null, config.relativeContentToPostTemplatePath + 'post-template.html'),
		renderFeed: render.bind(null, FEED_ROOT_POST)
	}
}
