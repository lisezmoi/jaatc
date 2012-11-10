(function(window){
  var document = window.document,
      canv = document.getElementsByTagName('canvas')[0],
      ctx = canv.getContext('2d'),
      roomSize = 100;
  
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    var rooms;
    if (xhr.readyState === 4) {
      rooms = JSON.parse(xhr.responseText);
      canv.width = rooms[0].length * roomSize + 1;
      canv.height = rooms.length * roomSize + 1;
      ctx.translate(0.5, 0.5);
      drawRooms(rooms);
    }
  };
  xhr.open('GET', '/rooms.json', true);
  xhr.send(null);
  
  function drawDoor(side, position, roomX, roomY) {
    var xBase = roomX,
        yBase = roomY;
    
    switch (side) {
      case 1:
        xBase = roomX + roomSize - 10;
        break;
      case 2:
        yBase = roomY + roomSize - 10;
        break;
    }
    
    console.log(xBase)
    if (side === 0 || side === 2) {
      xBase = xBase + (position * Math.round(roomSize/25));
    } else if (side === 1 || side === 3) {
      yBase = yBase + (position * Math.round(roomSize/15));
    }
    
    // + position * (roomSize / 20)
    
    
    ctx.strokeRect(xBase, yBase, 10, 10);
  }
  
  function drawRooms(rooms) {
    var room, doors;
    
    for (var i=0; i < rooms.length; i++) {
      for (var j=0; j < rooms[i].length; j++) {
        room = rooms[i][j];
        doors = room.doors;
        
        ctx.strokeStyle = 'grey';
        ctx.strokeRect(roomSize*j, roomSize*i, roomSize, roomSize);
        
        ctx.strokeStyle = 'red';
        for (var k=0; k < doors.length; k++) {
          if (doors[k] !== -1) {
            drawDoor(k, doors[k], j * roomSize, i * roomSize);
          }
        };
        
      };
    }
  }
  
})(this);