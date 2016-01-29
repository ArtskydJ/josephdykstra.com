var fs = require('fs')
var map = require('map')
var feed = require('./feeds.js')()
var noddity = require('./noddity.js')()
var getPosts = noddity.getPosts

var ROOT_DIR = __dirname + '/web/'

getPosts(function (err, posts) {
	if (err) throw err

	posts.forEach(function (post) {
		noddity.renderHtml(post, function (err, html) {
			if (err) throw err

			fs.writeFileSync(ROOT_DIR + post.filename.replace(/\.md$/, '.html'), html)
		})
	})

	// `feed` does not sort the posts by date
	// (https://github.com/jpmonette/feed/issues/28)
	// so they must be added in the correct order.
	// That's why I'm using `map`.
	var feedPosts = posts.slice(0, 5)

	map(noddity.renderFeed, feedPosts, function (err, htmlPostFeeds) {
		if (err) throw err

		feedPosts.forEach(function (post, i) {
			feed.add(post, htmlPostFeeds[i])
		})

		fs.writeFileSync(ROOT_DIR + 'feed.atom', feed.renderAtom())
		fs.writeFileSync(ROOT_DIR + 'feed.rss', feed.renderRss())
	})
})
