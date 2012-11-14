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

module.exports = function(){
  return new WebServer();
};