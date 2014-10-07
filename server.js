var http = require('http')
//var send = require('send')
//var sendOptions = require('config.json').sendOptions
var PORT = 80

http.createServer(function listener(req, res){
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end("This is Joseph Dykstra's website.\nObviously it is not finished yet...");
	//send(req, req.url, sendOptions).pipe(res)
}).listen(process.env.PORT || PORT).on('error', function (err) {
	if (err.code == 'EADDRINUSE') {
		console.log('Address in use, retrying...');
		setTimeout(function () {
			try {
				server.close();
			} catch (e) {
				console.error(e)
			} finally {
				server.listen(PORT);
			}
		}, 1000);
	}
})
