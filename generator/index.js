console.log('Resetting')
require('ractive').DEBUG = false
require('./init-html-dir-sync.js')

console.log('Generating')
require('./make-html-and-feeds.js')
require('./copy-static-files.js')
