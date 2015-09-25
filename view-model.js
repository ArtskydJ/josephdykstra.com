var Level = require('level-mem')
var Butler = require('noddity-butler')
var Linkifier = require('noddity-linkifier')
var render = require('noddity-render-static')
var renderData = require('./render-data.json')
var extend = require('xtend')

module.exports = function VModel() {
	var butler = new Butler('https://raw.githubusercontent.com/ArtskydJ/josephdykstra.com-content/master/', new Level())
	var renderOpts = {
		butler: butler,
		linkifier: new Linkifier('/'),
		data: renderData
	}

	butler.getPosts(function (err, posts) {
		if (err) throw err
		console.log('loaded ' + posts.length + ' posts')
	})

	return function (filename, cb) {
		butler.getPost('post-template.html', function (err, post) {
			if (err) {
				cb(err)
			} else {
				post.content = post.content.replace('{{{html}}}', '::' + filename + '::')

				render(post, renderOpts, cb)
			}
		})
	}
}
