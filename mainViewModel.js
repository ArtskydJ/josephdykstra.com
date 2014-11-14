var Ractive = require('ractive')
var config = require('./noddityConfig.json')
var Renderer = require('noddity-renderer')

module.exports = function MainViewModel(butler, mainRactiveTemplate) {
	var renderer = new Renderer(butler, function (s) {return s}) //String
	var changePostInRactive = null

	var titleRactive = new Ractive({
		el: '', //'title',
		template: '{{title}}{{#page}} | {{page}}{{/page}}',
		data: {
			title: config.title
		}
	})

	var mainRactive = new Ractive({
		el: '',
		template: mainRactiveTemplate,
		data: Object.create(config)
	})

	function doSomethingAboutThisError(err) {
		console.log(err)
	}

	function getPostList() {
		butler.getPosts(function(err, posts) {
			if (!err) {
				mainRactive.set('postList', posts.reverse().filter(function(post) {
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

	function changeCurrentPost(key, cb) {
		butler.getPost(key, function(err, post) {
			if (err) {
				mainRactive.set('html', err.message)
				titleRactive.set('page', null)
			} else {
				titleRactive.set('page', post.metadata.title)

				renderer.renderPost(post, cb)
				/*if (changePostInRactive) {
					changePostInRactive(post, cb)
				} else {
					changePostInRactive = renderer.renderPost(post, cb)
					//renderer.populateRootRactive(post, mainRactive)
				}*/

				if (!mainRactive.get('postList')) {
					getPostList()
				}
			}
		})
	}

	function onPostChanged(key, newValue, oldValue) { //oldValue does nothing right now
		function titleHasChanged(postListItem) {
			return postListItem.filename === key && postListItem.title !== newValue.metadata.title
		}

		var postList = mainRactive.get('postList')
		if (postList && postList.some(titleHasChanged)) {
			getPostList()
		}
	}

	butler.on('post changed', onPostChanged)
	butler.on('index changed', getPostList)

	return {
		//mainRactive: mainRactive,
		setCurrent: changeCurrentPost
	}
}
