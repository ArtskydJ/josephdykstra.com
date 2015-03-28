var qs = require('querystring')
var copyableElement = require('./element-copyable.js')
var killEvent = require('./kill-event.js')
var selectAll = require('./select-all.js')

function userInput() {
	var siteSearch = document.getElementById('site-search')

	siteSearch.onsubmit = function onsubmit(ev) {
		killEvent(ev)

		var path = window.location.origin + window.location.pathname
		var siteSearchText = document.getElementById('site-search-text')
		var text = siteSearchText.value
		var copyable = copyableElement()

		copyable.value = path.replace(/\/$/, '') + '/?' + qs.stringify({ q: text })
		selectAll(copyable)
	}
}

module.exports = userInput
