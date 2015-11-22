var Feed = require('feed')
var path = require('path')
var after = require('after')

var rssRootPost = {
	filename: '',
	content: '{{>current}}',
	metadata: { markdown: false }
}

module.exports = function (butler, render) {
	var feeds = {
		atom: '',
		rss: ''
	}

	function updateFeeds() {
		var authorJoseph = {
			name: 'Joseph Dykstra',
			email: 'josephdykstra@gmail.com',
			link: 'http://josephdykstra.com'
		}

		var feed = new Feed({
			title: 'Joseph Dykstra\'s Blog',
			description: 'Follow Joseph\'s opinions on your feed reader!',
			link: 'http://josephdykstra.com',
			image: 'http://josephdykstra.com/logo.png',
			copyright: 'Copyright © Joseph Dykstra 2015. Reuse is permitted.',
			author: authorJoseph
		})

		butler.getPosts({ mostRecent: 5 }, function (err, posts) {
			if (!err) {
				var next = after(posts.length, function () {
					feeds.atom = feed.render('atom-1.0')
					feeds.rss = feed.render('rss-2.0')
				})

				posts.forEach(function (post) {
					render(rssRootPost, post, function (err, html) {
						if (!err) {
							feed.addItem({
								title: post.metadata.title,
								link: 'http://josephdykstra.com/' + post.filename,
								description: html,
								author: [ authorJoseph ],
								date: post.metadata.date
							})
							next()
						}
					})
				})
			}
		})
	}

	updateFeeds()
	setInterval(updateFeeds, 2 * 60 * 60 * 1000).unref()

	return 	function getFeed(filename, res) {
		var type = path.extname(filename).slice(1)
		res.writeHead(200, {
			'Content-Type': 'application/' + type + '+xml'
		})
		res.end(feeds[type])
	}
}
