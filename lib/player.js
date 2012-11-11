var randomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var Player = function(){
  this.position = {x: randomInt(16, 800-16), y: randomInt(16, 480-16)};
  this.direction = {x: randomInt(0, 1), y: randomInt(0, 1)};
  this.dimensions = {x: 32, y: 32};
  this.speed = 0;
};

module.exports = Player;
