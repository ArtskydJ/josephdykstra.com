var fs = require('fs')
var path = require('path')
var map = require('map')
var feed = require('./feeds.js')()
var noddity = require('./noddity.js')()

function resolvePath(filename) {
	return path.resolve(__dirname, '..', filename)
}

noddity.getPosts(function (err, posts) {
	if (err) throw err

	posts.forEach(save)

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

		fs.writeFileSync(resolvePath('feed.atom'), feed.renderAtom())
		fs.writeFileSync(resolvePath('feed.rss'), feed.renderRss())
	})
})

noddity.getPost('index.md', function (err, post) {
	if (err) throw err

	save(post)
})

function save(post) {
	noddity.renderHtml(post, function (err, html) {
		if (err) throw err

		var htmlFilename = post.filename.replace(/\.md$/, '.html')
		fs.writeFileSync(resolvePath(htmlFilename), html)
	})
}
