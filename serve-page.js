module.exports = function VModel(render) {
	function servePage(statusCode, filename, res) {
		render(filename, function (err, html) {
			if (err) {
				if (statusCode === 200) { // disallow 404 recursion
					servePage(404, '404.md', res)
				} else {
					res.writeHead(500, {
						'Content-Type': 'text/plain'
					})
					res.end(err ? err.message : 'An unknown error occurred', 'utf8')
				}
			} else {
				res.writeHead(statusCode, {
					'Content-Type': 'text/html'
				})
				res.end(html, 'utf8')
			}
		})
	}

	return servePage.bind(null, 200)
}
