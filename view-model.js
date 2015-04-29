var noddityConfig = require('./noddity-config.json')
var fs = require('fs')

module.exports = function VModel(templateDir) {
	var Level = require('level-mem')
	var Retrieval = require('noddity-fs-retrieval')
	var Butler = require('noddity-butler')
	var Renderer = require('noddity-renderer')
	var ViewModel = require('noddity-view-model')
	var renderData = require('./render-data.json')
	var renderTemplate = fs.readFileSync(templateDir, { encoding:'utf8' })

	var db = new Level('./database')
	var retrieve = new Retrieval(noddityConfig.root)
	var butler = new Butler(retrieve, db, noddityConfig.butler)
	var renderer = new Renderer(butler, String)
	return new ViewModel(butler, renderer, renderTemplate, renderData)
}
