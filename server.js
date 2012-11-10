var http = require('http'),
    fs = require('fs');

http.createServer(function(req, res) {
  
  var urls = {
    '/': 'tpl/index.html',
    '/index.js': 'client/index.js'
  };
  
  var send = function(filename, code) {
    res.writeHead(code || 200, {'Content-Type': 'text/html'});
    var fileStream = fs.createReadStream(__dirname + '/' + filename);
    fileStream.pipe(res);
  };
  
  for (var i in urls) {
    if (req.url === i) {
      return send(urls[i]);
    }
  }
  
  return send('tpl/404.html', 404);
  
}).listen(8000);

console.log('Server running at http://0.0.0.0:8000/');
