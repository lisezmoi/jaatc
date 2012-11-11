var _ = require('underscore'),
    Player = require('./player'),
    Room = require('./room');

var World = function(){
  this.rooms = [];
  this.players = {};
};

World.prototype.eachRoom = function(cb) {
  for (var i=0; i < this.rooms.length; i++) {
    for (var j=0; j < this.rooms[i].length; j++) {
      if (cb(this.rooms[i][j], i, j) === false) {
        return this.rooms;
      }
    }
  }
  return this.rooms;
};

World.prototype.setRooms = function(rooms) {
  this.rooms = [];
  for (var i=0; i < rooms.length; i++) {
    this.rooms.push([]);
    for (var j=0; j < rooms[i].length; j++) {
      this.rooms[i].push(new Room(rooms[i][j], 'room-' + i + '-' + j));
    }
  }
};

World.prototype.getSiblingRoom = function(currentRoom, doorIndex) {
  var vIndex = 0, hIndex = 0;
  for (; vIndex < this.rooms.length; vIndex++) {
    if ((hIndex = this.rooms[vIndex].indexOf(currentRoom)) > -1) {
      break;
    }
  }
  
  switch (doorIndex) {
    case 0:
      vIndex--;
      break;
    case 1:
      hIndex++;
      break;
    case 2:
      vIndex++;
      break;
    case 3:
      hIndex--;
      break;
  }
  if (typeof this.rooms[vIndex] !== 'undefined' && typeof this.rooms[vIndex][hIndex] !== 'undefined') {
    return this.rooms[vIndex][hIndex];
  }
  return currentRoom;
};

World.prototype.changeRoom = function(player, oldRoom, doorIndex) {
  var newRoom = this.getSiblingRoom(oldRoom, doorIndex);
  oldRoom.removePlayer(player);
  var newDoorIndex = Room.getOppositeDoorIndex(doorIndex);
  var newDoorCoords = newRoom.getDoorCoords(newDoorIndex);
  player.position.x = newDoorCoords.position.x;
  player.position.y = newDoorCoords.position.y;
  switch (newDoorIndex) {
    case 0:
      player.position.y += player.dimensions.y;
      break;
    case 1:
      player.position.x -= player.dimensions.x;
      break;
    case 2:
      player.position.y -= player.dimensions.y;
      break;
    case 3:
      player.position.x += player.dimensions.x;
      break;
  }
  newRoom.addPlayer(player);
  return newRoom;
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
  return this.rooms[ 1 ][ 1 ]; // debug
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
