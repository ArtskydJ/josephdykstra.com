console.log('Resetting')
require('ractive').DEBUG = false
require('./init-html-dir-sync.js')

console.log('Generating')
require('./update-index-json.js')
require('./make-redirects.js')
require('./make-html-and-feeds.js')(function () {
	require('./copy-static-files.js')
})


