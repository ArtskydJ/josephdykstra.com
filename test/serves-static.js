var test = require('tape')
var simpleGet = require('simple-get')
var closeServer = require('../server.js')

function assert(url, expectCode, expectStr) {
	test(url, function (t) {
		simpleGet.concat(url, function (err, data, res) {
			t.ifError(err)
			t.equal(res.statusCode, expectCode, 'status code is ' + expectCode)
			t.ok(data.toString().indexOf(expectStr), 'matches string')
			t.end()
		})
	})
}

assert('http://localhost', 200, 'I\'m Joseph Dykstra. I like writing code and making silly puns.')
assert('http://localhost/index', 200, 'I\'m Joseph Dykstra. I like writing code and making silly puns.')
assert('http://localhost/index.md', 200, 'I\'m Joseph Dykstra. I like writing code and making silly puns.')
assert('http://localhost/feed.atom', 200, '<?xml version="1.0" encoding="utf-8"?>\n\r<feed xmlns="http://www.w3.org/2005/Atom">')
assert('http://localhost/feed.xml', 404)
assert('http://localhost/feed.rss', 200, '<?xml version="1.0" encoding="utf-8"?>\n\r<rss version="2.0">\n\r    <channel>')
assert('http://localhost/lolwut-not-found', 404, 'Can\'t find that page!')
assert('http://localhost/bootstrap.min.css', 200, 'bootswatch')

test('end', function (t) {
	closeServer()
	t.end()
})
