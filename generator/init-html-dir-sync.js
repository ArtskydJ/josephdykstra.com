var rimraf = require('rimraf')
var htmlDir = require('./config.json').relativeGeneratorToHtmlPath

rimraf.sync(htmlDir + '*')
