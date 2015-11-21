var Feed = require('feed')
var path = require('path')

module.exports = function (butler) {
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
				posts.forEach(function (post) {
					feed.addItem({
						title: post.metadata.title,
						link: 'http://josephdykstra.com/' + post.metadata.title.toLowerCase().replace(/ /g, '-'),
						description: getDescription(post),
						author: [ authorJoseph ],
						date: post.metadata.date
					})
				})

				feeds.atom = feed.render('atom-1.0')
				feeds.rss = feed.render('rss-2.0')
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

function getDescription(post) {
	return post.content.replace(/([\s\S]{150}\w*)([\s\S]*)/, '$1') + '...'
}
