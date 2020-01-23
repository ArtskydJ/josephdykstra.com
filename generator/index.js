console.log('Resetting')
require('ractive').DEBUG = false
require('./init-html-dir-sync.js')

console.log('Generating')
require('./update-index-json.js')
require('./make-redirects.js')
require('./copy-static-files.js').then(() => {
	require('./make-html-and-feeds.js')
})

