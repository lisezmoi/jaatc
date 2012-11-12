var fs = require('fs');
var http    = require('http');
var express = require('express');
var ejs     = require('ejs');

var WebServer = function(){
  this.httpApp = express();
  this.httpServer = http.createServer(this.httpApp);
};

WebServer.prototype.configure = function(cb) {
  this.httpApp.engine('html', ejs.renderFile);
  cb.call(this, this.httpApp, express);
};

WebServer.prototype.listen = function(port) {
  this.httpServer.listen(port);
};

WebServer.prototype.compressJS = function(scripts, dirPath) {
  var UglifyJS = require('uglify-js2');
  var addPath = function(script) { return dirPath + '/' + script; };
  var result;
  for (var i in scripts) {
    result = UglifyJS.minify(scripts[i].map(addPath));
    fs.writeFileSync(dirPath + '/' + i, result.code, 'utf8');
  }
};

module.exports = function(){
  return new WebServer();
};