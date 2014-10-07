var http = require('http')
//var send = require('send')
//var sendOptions = require('config.json').sendOptions

http.createServer(function listener(req, res){
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end("This is Joseph Dykstra's website.\nObviously it is not finished yet...");
	//send(req, req.url, sendOptions).pipe(res)
}).listen(process.env.PORT || 3000)
