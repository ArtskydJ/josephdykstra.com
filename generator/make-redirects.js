var writeFile = require('./lib/write-file.js')
var config = require('./config.json')
var htmlDir = config.relativeGeneratorToHtmlPath
var redirectsPath = config.relativeGeneratorToContentPath

var redirects = require(redirectsPath + 'redirects.json')

Object.keys(redirects).forEach(function (key) {
	var fromFilename = key + '.html'
	var toUrl = redirects[key]

	var redirectFileContents = generateRedirectFile(toUrl)
	writeFile(htmlDir, fromFilename, redirectFileContents)
})

function generateRedirectFile(url) {
	// http://stackoverflow.com/a/5411601/1509389
	return (
		'<!DOCTYPE HTML>\n' +
		'<html lang="en-US">\n' +
		'\t<head>\n' +
		'\t\t<meta charset="UTF-8">\n' +
		'\t\t<meta http-equiv="refresh" content="1;url=' + url + '">\n' +
		'\t\t<script type="text/javascript">\n' +
		'\t\t\twindow.location.href = "' + url + '"\n' +
		'\t\t</script>\n' +
		'\t\t<title>Redirect</title>\n' +
		'\t</head>\n' +
		'\t<body>\n' +
		'\t\tIf you are not redirected automatically, <a href="' + url + '">follow this link</a>\n' +
		'\t</body>\n' +
		'</html>\n'
	)
}
