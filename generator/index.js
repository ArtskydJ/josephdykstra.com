console.log('Resetting')
require('ractive').DEBUG = false
require('./init-html-dir-sync.js')

console.log('Generating')
require('./make-html-and-feeds.js')
require('./copy-static-files.js')

process.once('beforeExit', function () {
	// I'm not a big fan of this solution, but it allows all my other code to be
	// asynchronous and not care about flow control, or know when when it's done running.
	console.log('Minifying')
	require('./minify-css.js')
})
