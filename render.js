var Ractive = require('ractive')

function cbIfErr(onErr, noErr) {
	return function (err) {
		if (err && !err.notFound) onErr(err)
		else noErr.apply(null, [].slice.call(arguments, 1))
	}
}

function formatButlerPostList(posts) {
	return posts.reverse().filter(function(post) {
		return typeof post.metadata.title === 'string'
	}).map(function(post) {
		return {
			title: post.metadata.title,
			filename: post.filename.replace(/\.md$/, '')
		}
	})
}

module.exports = function Render(ractiveTemplate, ractiveData, butler, renderer) {
	var ractive = new Ractive({
		el: '',
		template: ractiveTemplate,
		data: Object.create(ractiveData)
	})

	function getPostListFromButler(cb) {
		cb = cb || function () {}
		butler.getPosts(cbIfErr(cb, function (posts) {
			var postList = formatButlerPostList(posts)
			ractive.set('postList', postList)
			cb(null, postList)
		}))
	}

	//If not has post list: get it from butler
	//return the post list
	function getCurrentPostList(cb) {
		cb = cb || function () {}
		var postList = ractive.get('postList')
		if (postList) {
			process.nextTick(cb.bind(null, null, postList))
		} else {
			getPostListFromButler(cb)
		}
	}

	function setCurrent(key, cb) {
		butler.getPost(key + '.md', cbIfErr(cb, function (post) {
			ractive.set('page', post.metadata.title)
			ractive.set('date', post.metadata.date)
			getCurrentPostList(function () {
				renderer.renderPost(post, cbIfErr(cb, function (html) {
					ractive.set('html', html)
					cb(null, ractive.toHTML())
				}))
			})
		}))
	}

	function onPostChanged(key, newValue, oldValue) { //oldValue does nothing right now
		function titleHasChanged(postListItem) {
			return postListItem.filename === key && postListItem.title !== newValue.metadata.title
		}

		var postList = ractive.get('postList')
		if (postList && postList.some(titleHasChanged)) {
			getPostListFromButler()
		}
	}

	butler.on('post changed', onPostChanged)
	butler.on('index changed', getCurrentPostList)
	return setCurrent
}
