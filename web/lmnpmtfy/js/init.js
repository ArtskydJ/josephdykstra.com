var qs = require('querystring')

function setup() {
	document.getElementById('site-search-text').value = ''
	var hashExists = /#/.test(window.location.href)
	var query = window.location.search.slice(1)
	return hashExists ? null : qs.parse(query).q
}

module.exports = setup
