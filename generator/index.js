var fs = require('fs')
var map = require('map')
var feed = require('./feeds.js')()
var noddity = require('./noddity.js')()
var writeDestinationFileSync = require('./write-dest-file-sync.js')

noddity.getPosts(function (err, posts) {
	if (err) throw err

	// These don't need to be generated in the correct order
	posts.forEach(save)

	// The posts start in the correct order, but `feed` does not sort the posts by date
	// (https://github.com/jpmonette/feed/issues/28) so they must be added in the correct
	// order. That's why I'm using `map`; to render and add them in series.

	// Take last 5, and put the most recent first
	var feedPosts = posts.slice(-5).reverse()

	map(noddity.renderFeed, feedPosts, function (err, htmlPostFeeds) {
		if (err) throw err

		feedPosts.forEach(function (post, i) {
			feed.add(post, htmlPostFeeds[i])
		})

		writeDestinationFileSync('feed.atom', feed.renderAtom())
		writeDestinationFileSync('feed.rss', feed.renderRss())

		noddity.getPost('index.md', function (err, post) {
			if (err) throw err

			save(post)
		})
	})
})

function save(post) {
	noddity.renderHtml(post, function (err, html) {
		if (err) throw err

		var htmlFilename = post.filename.replace(/\.md$/, '.html')
		writeDestinationFileSync(htmlFilename, html)
	})
}
