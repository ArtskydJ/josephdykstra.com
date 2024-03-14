var cp = require('child_process')
var map = require('map')
var writeFile = require('./lib/write-file.js')
var feed = require('./lib/feeds.js')()
var noddity = require('./lib/noddity.js')()
var config = require('./config.json')
var htmlDir = config.relativeGeneratorToHtmlPath
var contentDir = config.relativeGeneratorToContentPath

noddity.getPost('index.md', function (err, post) {
	if (err) throw err

	savePost(post)
})

noddity.getPost('resume.md', function (err, post) {
	if (err) throw err

	noddity.renderFeed(post, function (err, html) {
		if (err) throw err

		html = '<link href="./styles.css?" rel="stylesheet">' + html
		writeFile(contentDir, 'resume-pdf.html', html)

		require('fs').unlinkSync(contentDir + 'resume-pdf.html')
		cp.exec('wkhtmltopdf ' + contentDir + 'resume-pdf.html ' + contentDir + 'resume.pdf', function (err, stdout) {
			if (err) throw err
			cbWhenResumePdfIsGenerated()
		})
	})
})

noddity.getPosts(function (err, posts) {
	if (err) throw err

	// These don't need to be generated in the correct order
	posts.forEach(savePost)

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

		writeFile(htmlDir, 'feed.atom', feed.renderAtom())
		writeFile(htmlDir, 'feed.rss', feed.renderRss())
	})
})

function savePost(post) {
	noddity.renderHtml(post, function (err, html) {
		if (err) throw err

		var htmlFilename = post.filename.replace(/\.md$/, '.html')
		writeFile(htmlDir, htmlFilename, html)
	})
}

var cbWhenResumePdfIsGenerated = function() {}
module.exports = function(cb) {
	cbWhenResumePdfIsGenerated = cb
}
