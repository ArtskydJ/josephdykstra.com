var fs = require('fs')
var config = require('./config.json')
var relContentPath = config.relativeGeneratorToContentPath
var posts = require(relContentPath + 'index.json')

var newPosts = fs.readdirSync(relContentPath)
	.filter(isPost)
	.filter(isNotInIndexJson)

if (newPosts.length > 1) {
	console.error('You can only have one extra post to automatically insert into the index.json file')
	console.error('The following posts are not in your index.json yet: ' + newPosts.join(', '))
	process.exit(1)
} else if (newPosts.length === 1) {
	posts.unshift(newPosts[0])
	var indexJson = JSON.stringify(posts)
		.replace(/(\[|,)"/g, '$1\n  "')
		.replace('"]', '"\n]\n')
	fs.writeFileSync(relContentPath + 'index.json', indexJson)
} else {
	// console.log('No new posts found')
}

function isPost(filename) {
	return (
		filename !== 'index.md' && // Main page
		filename[0] !== '_' && // Unfinished post
		filename.slice(-3) === '.md'
	)
}

function isNotInIndexJson(filename) {
	return posts.indexOf(filename) === -1
}
