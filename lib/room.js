// Need to be moved...
var TILE_SIZE = 32,
    H_CELLS = 25,
    V_CELLS = 15;

var Room = function(data, id, players){
  this.id = id || 'room-undefined';
  this.players = players || [];
  this.doors = data.doors || [-1, -1, -1, -1];
};
Room.prototype.removePlayer = function(player) {
  for (var i=0; i < this.players.length; i++) {
    if (this.players[i].id === player.id) {
      return this.players.splice(i, 1);
    }
  }
};
Room.prototype.addPlayer = function(player) {
  this.players.push(player);
};

Room.prototype.getDoorCoords = function(side) {
  var position = {x: TILE_SIZE/2, y: TILE_SIZE/2},
      dimensions = {x: TILE_SIZE, y: TILE_SIZE},
      coordinates = this.doors[side];

  switch (side) {
    case 1:
      position.x = TILE_SIZE * H_CELLS - TILE_SIZE/2;
      break;
    case 2:
      position.y = TILE_SIZE * V_CELLS - TILE_SIZE/2;
      break;
  }
  
  if (side === 0 || side === 2) {
    dimensions.y /= 2;
    if (side === 0) {
      position.y -= dimensions.y/2;
    } else {
      position.y += dimensions.y/2;
    }
    position.x = position.x + (coordinates * TILE_SIZE);
  
  } else if (side === 1 || side === 3) {
    dimensions.x /= 2;
    if (side === 3) {
      position.x -= dimensions.x/2;
    } else {
      position.x += dimensions.x/2;
    }
    position.y = position.y + (coordinates * TILE_SIZE);
  }
  
  return {
    position: position,
    dimensions: dimensions
  };
};

Room.getOppositeDoorIndex = function(doorIndex) {
  return doorIndex + ((doorIndex < 2)? 2 : -2);
};

module.exports = Room;
