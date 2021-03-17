var crypto = require('crypto')
var Feed = require('feed')

function makeId(str) {
	var hasher = crypto.createHash('md5')
	hasher.update(str)
	var hash = hasher.digest('hex')
	return hash.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5')
}

module.exports = function () {
	var authorJoseph = {
		name: 'Joseph Dykstra',
		email: 'josephdykstra@gmail.com',
		link: 'https://www.josephdykstra.com'
	}

	var feed = new Feed({
		title: 'Joseph Dykstra\'s Blog',
		description: 'Follow Joseph\'s opinions on your feed reader!',
		link: 'https://www.josephdykstra.com',
		image: 'http://josephdykstra.com/logo.png',
		copyright: 'Copyright © Joseph Dykstra 2016.',
		author: authorJoseph,
		id: makeId('http://josephdykstra.com')
	})

	function add(post, html) {
		var link = 'https://www.josephdykstra.com/' + post.filename.replace(/\.md$/, '')

		feed.addItem({
			title: post.metadata.title,
			link: link,
			description: html,
			author: [ authorJoseph ],
			date: post.metadata.date,
			// Unfortunately, if the link changes, so will the ID.
			// The links shouldn't be changing, so hopefully this doesn't become an issue.
			id: makeId(link)
		})
	}

	return {
		add: add,
		renderAtom: feed.render.bind(feed, 'atom-1.0'),
		renderRss: feed.render.bind(feed, 'rss-2.0')
	}
}
