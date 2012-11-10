var World = function(){
  this.build(100);
}

World.prototype.build = function(roomsCount) {
  
};


exports.getWorld = function(){
  return new World();
};