var fs = require('fs')
var ent = require('ent')
var posts = fs.readFileSync('./normalized_posts.txt', 'utf8').split('__________')

posts.forEach(function (post) {
	var parts = post.split('\n')
	var title = parts[8]
	var filename = title.toLowerCase().replace(/[^\w\d]+/g, '-') + '.md'
	var date = parts[7].slice(0, 10)
	var content = ent.decode(parts[9])

	var normalizedContent = content
		.replace(/<br \/>/g, '\n\n')
		.replace(/<a href="([^"]+)">([^<]*)<\/a>/g, '[$2]($1)')
		.replace(/\n(.*(?:\d.{0,2} )?\w+ \d+?:\d+(?:[-,]\d+)*)/g, '\n> $1')
		.replace(/<\/?b>/g, '**')
		.replace(/<\/?i>/g, '*')
		.replace(/<[^>]+>/g, '')
		.replace(/&nbsp;/g, ' ')
		.replace(/(\n\n){2,}/g, '\n\n')

	var newFile = '---\n' +
		'title: ' + title + '\n' +
		'date: ' + date + '\n' +
		'---\n\n' + normalizedContent + '\n' //+ '\n<!--' + content + '-->\n'

	fs.writeFileSync('../' + filename, newFile)
})
