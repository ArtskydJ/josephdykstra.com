var Feed = require('feed')

module.exports = function () {
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
		copyright: 'Copyright © Joseph Dykstra 2015.',
		author: authorJoseph
	})

	function add(post, html) {
		feed.addItem({
			title: post.metadata.title,
			link: 'http://josephdykstra.com/' + post.filename, // + '.html' maybe?
			description: html,
			author: [ authorJoseph ],
			date: post.metadata.date
		})
	}
	
	return {
		add: add,
		renderAtom: feed.render.bind(feed, 'atom-1.0'),
		renderRss: feed.render.bind(feed, 'rss-2.0')
	}
}