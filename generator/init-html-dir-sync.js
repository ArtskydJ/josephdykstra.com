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
	try {
		fs.unlinkSync(path.join(htmlDir, file))
	} catch (err) {
		if (file !== '.git') throw err
	}
})
