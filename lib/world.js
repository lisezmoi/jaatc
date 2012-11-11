var _ = require('underscore'),
    Player = require('./player');

var World = function(){
  this.rooms = [];
  this.players = {};
};

World.prototype.eachRoom = function(cb) {
  for (var i=0; i < this.rooms.length; i++) {
    for (var j=0; j < this.rooms[i].length; j++) {
      if (cb(this.rooms[i][j]) === false) {
        return this.rooms;
      }
    }
  }
  return this.rooms;
};

World.prototype.setRooms = function(rooms) {
  this.rooms = rooms;
  this.eachRoom(function(room){
    room.players = [];
  });
};

World.prototype.getRoomByPlayerId = function(id, cb) {
  var found = false;
  this.eachRoom(function(room){
    for (var i=0; i < room.players.length; i++) {
      if (room.players[i].id === id) {
        found = true;
        cb(null, room);
        return false;
      }
    }
  });
  if (!found) {
    cb('not found');
  }
};

World.prototype.getRandomRoom = function() {
  return this.rooms[ _.random(this.rooms.length-1) ][ _.random(this.rooms[0].length-1) ];
};

World.prototype.getPlayerById = function(id) {
  return this.players[id];
};

World.prototype.addPlayer = function(id, cb) {
  
  var player = this.getPlayerById(id);
  if (player) {
    return this.getRoomByPlayerId(player.id, function(err, room){
      if (!err) {
        cb(room);
      }
    });
  }
  
  player = new Player();
  player.id = id;
  this.players[id] = player;
  
  var room = this.getRandomRoom();
  room.players.push(player);
  
  return cb(room);
};

module.exports = function getWorld(rooms){
  var world = new World();
  world.setRooms(rooms);
  return world;
};
