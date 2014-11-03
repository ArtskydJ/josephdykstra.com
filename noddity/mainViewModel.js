var Ractive = require('ractive')
var config = noddityConfig
var Renderer = require('noddity-renderer')

module.exports = function MainViewModel(butler) {
	var renderer = new Renderer(butler)
	var changePostInRactive = null

	var titleRactive = new Ractive({
		el: 'title',
		template: '{{title}}{{#page}} | {{page}}{{/page}}',
		data: {
			title: config.title
		}
	})

	var mainRactive = new Ractive({
		el: 'main',
		template: '#template-main',
		data: Object.create(config)
	})

	var sidebarTemplate = config.sidebar ? '{{{html}}}' : '#template-menu'

	var sidebarRactive = new Ractive({
		el: 'sidebar',
		template: sidebarTemplate,
		data: Object.create(config)
	})

	if (config.sidebar) {
		butler.getPost(config.sidebar, function(err, post) {
			if (err) {
				sidebarRactive.set('html', err.message)
			} else {
				renderer.populateRootRactive(post, sidebarRactive)
			}
		})
	}

	function doSomethingAboutThisError(err) {
		console.log(err)
	}

	function getPostList() {
		butler.getPosts(function(err, posts) {
			if (!err) {
				sidebarRactive.set('postList', posts.reverse().filter(function(post) {
					return typeof post.metadata.title === 'string'
				}).map(function(post) {
					return {
						title: post.metadata.title,
						filename: post.filename
					}
				}))
			} else {
				doSomethingAboutThisError(err)
			}
		})
	}

	function changeCurrentPost(key) {
		butler.getPost(key, function(err, post) {
			if (err) {
				mainRactive.set('html', err.message)
				titleRactive.set('page', null)

				if (key !== config.errorPage) {
					window.location = window.location.origin
						+ window.location.pathname
						+ config.pathPrefix
						+ config.pagePathPrefix
						+ config.errorPage
				}
			} else {
				titleRactive.set('page', post.metadata.title)

				if (changePostInRactive) {
					changePostInRactive(post)
				} else {
					changePostInRactive = renderer.populateRootRactive(post, mainRactive)
				}

				if (!sidebarRactive.get('postList')) {
					getPostList()
				}
			}
		})
	}

	function onPostChanged(key, newValue, oldValue) {
		function titleHasChanged(postListItem) {
			return postListItem.filename === key && postListItem.title !== newValue.metadata.title
		}

		var postList = sidebarRactive.get('postList')
		if (postList && postList.some(titleHasChanged)) {
			getPostList()
		}
	}

	butler.on('post changed', onPostChanged)
	butler.on('index changed', getPostList)

	return {
		setCurrent: changeCurrentPost
	}
}
