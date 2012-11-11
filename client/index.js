(function(window, io, Math2, KeyboardJS, sessionID){
  var document = window.document,
      canv = document.getElementsByTagName('canvas')[0],
      ctx = canv.getContext('2d'),
      Vector2D = Math2.Vector2D,
      tileSize = 32,
      PLAYER_SPEED = 10,
      V_CELLS = 25,
      H_CELLS = 15,
      room = null,
      players = [],
      cPlayer = null,
      canvWidth = 0,
      canvHeight = 0;
  
  canvWidth = canv.width = tileSize * V_CELLS; // 800
  canvHeight = canv.height = tileSize * H_CELLS; // 480
  
  var socket = io.connect('http://localhost');
  
  socket.emit('new player', sessionID);
  
  socket.on('room', function(newRoom) {
    var player;
    room = newRoom;
    console.log('room', room);
    for (var i=0; i < room.players.length; i++) {
      
      player = new Player();
      player.id = room.players[i].id;
      player.dimensions.x = room.players[i].dimensions.x;
      player.dimensions.y = room.players[i].dimensions.y;
      player.position.x = room.players[i].position.x;
      player.position.y = room.players[i].position.y;
      player.direction.x = room.players[i].direction.x;
      player.direction.y = room.players[i].direction.y;
      player.direction.normalize();
      
      if (player.id === sessionID) {
        cPlayer = player;
      }
      players.push(player);
    }
    drawRoom(room);
  });
  
  var Player = function(){
    this.position = new Vector2D(0, 0);
    this.direction = new Vector2D(0, 0);
    this.dimensions = new Vector2D(tileSize, tileSize);
  };
  Player.prototype.draw = function(){
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.direction.getAngle());
    ctx.fillStyle = 'red';
    ctx.fillRect(-this.dimensions.x/2, -this.dimensions.y/2, this.dimensions.x, this.dimensions.y);
    ctx.restore();
  };
  
  var drawRoom = function(room) {
    // for (var i=0; i < room.doors.length; i++) {
    //   if ()
    //   room.doors[i]
    // }
  };
  
  // Keyboard
  var activeKeys = [];
  var activeKey = function(key) {
    return activeKeys.indexOf(key) !== -1;
  };
  
  var loop = makeLoop(30, function(now){
    if (!room) return;
    
    activeKeys = KeyboardJS.activeKeys();
    cPlayer.speed = 0;
    
    // Direction
    if (activeKey('left')) {
      cPlayer.direction.x = -1;
      cPlayer.speed = PLAYER_SPEED;
      
    } else if (activeKey('right')) {
      cPlayer.direction.x = 1;
      cPlayer.speed = PLAYER_SPEED;
    }
    if (activeKey('up')) {
      cPlayer.direction.y = -1;
      cPlayer.speed = PLAYER_SPEED;
      
    } else if (activeKey('down')) {
      cPlayer.direction.y = 1;
      cPlayer.speed = PLAYER_SPEED;
    }
    
    if ((activeKey('up') || activeKey('down')) && (!activeKey('left') && !activeKey('right'))) {
      cPlayer.direction.x = 0;
    }
    if ((activeKey('left') || activeKey('right')) && (!activeKey('up') && !activeKey('down'))) {
      cPlayer.direction.y = 0;
    }
    cPlayer.direction.normalize();
    
    // Move
    cPlayer.position.add(Vector2D.multiply(cPlayer.direction, cPlayer.speed));
    // Limits
    if (cPlayer.position.x + cPlayer.dimensions.x/2 > canvWidth) {
      cPlayer.position.x = canvWidth - cPlayer.dimensions.x/2;
    } else if (cPlayer.position.x < cPlayer.dimensions.x/2) {
      cPlayer.position.x = cPlayer.dimensions.x/2;
    }
    if (cPlayer.position.y + cPlayer.dimensions.y/2 > canvHeight) {
      cPlayer.position.y = canvHeight - cPlayer.dimensions.y/2;
    } else if (cPlayer.position.y < cPlayer.dimensions.y/2) {
      cPlayer.position.y = cPlayer.dimensions.y/2;
    }
    
    // Drawing
    canv.width = canvWidth;
    
    drawRoom(room);
    
    // Draw players
    for (var i=0; i < players.length; i++) {
      players[i].draw();
    }
  });
  loop.start();
  
})(this, this.io, this.Math2, this.KeyboardJS, this.sessionID);