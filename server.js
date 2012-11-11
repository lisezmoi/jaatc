var http = require('http'),
    fs = require('fs'),
    express = require('express'),
    httpApp = express(),
    httpServer = http.createServer(httpApp),
    io = require('socket.io').listen(httpServer),
    rooms = require('./rooms.json'),
    getWorld = require('./lib/world');

var world = getWorld(rooms);

io.sockets.on('connection', function(socket) {
  socket.on('new player', function(sessionID) {
    world.addPlayer(sessionID, function(room){
      socket.emit('room', room);
    });
  });
});

httpApp.set('views', __dirname + '/tpl');
httpApp.engine('html', require('ejs').renderFile);
httpApp.use(express['static'](__dirname + '/client'));
httpApp.use(express.cookieParser('srautie nrauet eauits'));
httpApp.use(express.session());

httpApp.get('/', function(req, res){
  res.render('index.html', {sessionID: req.sessionID}, function(err, html){
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

httpServer.listen(8000);

console.log('Server running at http://0.0.0.0:8000/');
