var fs = require('fs')
var path = require('path')
var htmlDir = require('./config.json').relativeGeneratorToHtmlPath

try {
	fs.mkdirSync(htmlDir)
} catch (err) {
	if (err.code !== 'EEXIST') throw err
}

// rm -rf htmlDir
fs.readdirSync(htmlDir).forEach(function (file) {
	fs.unlinkSync(path.join(htmlDir, file))
})
