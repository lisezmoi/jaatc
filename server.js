var http = require('http'),
    fs = require('fs'),
    express = require('express'),
    httpApp = express(),
    httpServer = http.createServer(httpApp),
    io = require('socket.io').listen(httpServer),
    rooms = require('./rooms.json'),
    getWorld = require('./lib/world');

var world = getWorld(rooms);

io.set('log level', 1);

io.sockets.on('connection', function(socket) {
  socket.on('new player', function(sessionID) {
    world.addPlayer(sessionID, function(room){
      socket.join(room.id);
      socket.emit('room', room);
      socket.broadcast.to(room.id).emit('room players', room.players);
    });
  });
  socket.on('new position', function(exportPlayer) {
    if (!exportPlayer || !exportPlayer.id || !exportPlayer.position) return;
    var player = world.getPlayerById(exportPlayer.id);
    if (player) {
      player.position.x = exportPlayer.position.x;
      player.position.y = exportPlayer.position.y;
      player.direction.x = exportPlayer.direction.x;
      player.direction.y = exportPlayer.direction.y;
      player.speed = exportPlayer.speed;
      world.getRoomByPlayerId(player.id, function(err, playerRoom){
        socket.broadcast.to(playerRoom.id).emit('player update', player);
      });
    }
  });
  socket.on('door collision', function(data) {
    var exportPlayer = data.player,
        doorIndex = data.doorIndex,
        newRoom;
    if (!exportPlayer || !exportPlayer.id || !exportPlayer.position) return;
    var player = world.getPlayerById(exportPlayer.id);
    if (!player) { return; }
    world.getRoomByPlayerId(player.id, function(err, oldRoom){
      var newRoom = world.changeRoom(player, oldRoom, doorIndex);
      socket.leave(oldRoom.id);
      socket.broadcast.to(oldRoom.id).emit('room players', oldRoom.players);
      socket.join(newRoom.id);
      socket.broadcast.to(newRoom.id).emit('room players', newRoom.players);
      socket.emit('room', newRoom);
    });
  });
});

httpApp.set('views', __dirname + '/tpl');
httpApp.engine('html', require('ejs').renderFile);
httpApp.use(express['static'](__dirname + '/client'));
httpApp.use(express.cookieParser('srautie nrauet eauits'));
httpApp.use(express.session());

httpApp.get('/', function(req, res){
  var params = {
    sessionID: req.sessionID,
    domain: process.env.PROD_DOMAIN || 'localhost'
  };
  res.render('index.html', params, function(err, html){
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
