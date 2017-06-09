var rimraf = require('rimraf')
var path = require('path')
var htmlDir = require('./config.json').relativeGeneratorToHtmlPath

rimraf.sync(htmlDir + '*')
