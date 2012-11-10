var http = require('http'),
    fs = require('fs'),
    express = require('express'),
    httpApp = express(),
    rooms = require('./rooms.json'),
    getWorld = require('./lib/world');

// var world = getWorld(rooms);

httpApp.set('views', __dirname + '/tpl');
httpApp.engine('html', require('ejs').renderFile);
httpApp.use(express.static(__dirname + '/client'));

httpApp.get('/', function(req, res){
  res.render('index.html', function(err, html){
    res.send(html);
  });
});

httpApp.get('/debug', function(req, res){
  res.render('debug.html', function(err, html){
    res.send(html);
  });
});

httpApp.get('/rooms.json', function(req, res){
  res.send(rooms);
});

httpApp.listen(8000);

console.log('Server running at http://0.0.0.0:8000/');
