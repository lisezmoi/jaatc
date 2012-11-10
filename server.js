var http = require('http'),
    fs = require('fs');

var contentTypes = { 'html': 'text/html; charset=UTF-8', 'js': 'text/javascript; charset=UTF-8', 'json': 'application/json' };

function getExt(filename) {
  var fSplit = filename.split('.');
  return fSplit[fSplit.length-1];
}

http.createServer(function(req, res) {
  
  var urls = {
    '/': 'tpl/index.html',
    '/index.js': 'client/index.js',
    '/debug': 'tpl/debug.html',
    '/debug.js': 'client/debug.js',
    '/rooms.json': 'rooms.json'
  };
  
  
  var send = function(filename, code) {
    res.writeHead(code || 200, {'Content-Type': contentTypes[getExt(filename)]});
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
