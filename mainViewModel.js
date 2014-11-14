var Ractive = require('ractive')
var config = require('./noddityConfig.json')
var Renderer = require('noddity-renderer')

function cbIfErr(onErr, noErr) {
	return function (err) {
		if (err && !err.notFound) onErr(err)
		else noErr.apply(null, [].slice.call(arguments, 1))
	}
}

module.exports = function MainViewModel(ractiveTemplate, butler, renderer) {

	var ractive = new Ractive({
		el: '',
		template: ractiveTemplate,
		data: Object.create(config)
	})

	function createPostList(posts) {
		return posts.reverse().filter(function(post) {
			return typeof post.metadata.title === 'string'
		}).map(function(post) {
			return {
				title: post.metadata.title,
				filename: post.filename.replace(/\.md$/, '')
			}
		})
	}

	function getPostList(cb) {
		cb = cb || function () {}
		var postList = ractive.get('postList')
		if (postList) {
			process.nextTick(cb.bind(null, null, postList))
		} else {
			butler.getPosts(cbIfErr(cb, function (posts) {
				postList = createPostList(posts)
				ractive.set('postList', postList)
				cb(null, postList)
			}))
		}
	}

	function changeCurrentPost(key, cb) {
		butler.getPost(key, cbIfErr(cb, function (post) {
			ractive.set('page', post.metadata.title)
			getPostList(function () {
				renderer.renderPost(post, cbIfErr(cb, function (html) {
					ractive.set('html', html)
					cb(null, ractive.toHTML())
				}))
			})
		}))
	}

	/*function onPostChanged(key, newValue, oldValue) { //oldValue does nothing right now
		function titleHasChanged(postListItem) {
			return postListItem.filename === key && postListItem.title !== newValue.metadata.title
		}

		var postList = ractive.get('postList')
		if (postList && postList.some(titleHasChanged)) { //i broke this code!!!
			getPostList()
		}
	}

	butler.on('post changed', onPostChanged)*/
	butler.on('index changed', getPostList)

	return {
		setCurrent: changeCurrentPost
	}
}
