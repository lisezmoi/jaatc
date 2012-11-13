(function(name, definition) {
  if (typeof define == 'function') {
    define(definition);
  } else if (typeof module != 'undefined') {
    module.exports = definition();
  } else {
    this[name] = definition();
  }
})('Math2', function(){
  'use strict';
  
  var Math2 = {};
  
  /* Check if an object is a number */
  var isNumber = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Number]';
  };
  
  /* Get a random int between two values */
  var randomInt = function(min, max, excludes) {
    var result = Math.floor(Math.random() * (max - min + 1)) + min;
    if (excludes && excludes.indexOf(result) !== -1) {
      return randomInt(min, max, excludes);
    }
    return result;
  };
  
  /* Change the "scale" of a value  */
  var map = function(value, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
  };
  
  /* Vector 2D Object */
  var Vector2D = function(obj1, obj2) {
    if (obj1) {
      this.set(obj1, obj2);
    } else {
      this.set({x: 0, y: 0});
    }
  };
  Vector2D.prototype.set = function(obj1, obj2) {
    if (isNumber(obj1) && isNumber(obj2)) {
      this.x = obj1;
      this.y = obj2;
    } else {
      this.x = obj1.x;
      this.y = obj1.y;
    }
  };
  
  /* Operators */
  Vector2D.prototype.add = function(v2d) {
    if (isNumber(v2d)) {
      v2d = {x: v2d, y: v2d};
    }
    this.x += v2d.x;
    this.y += v2d.y;
    return this;
  };
  Vector2D.prototype.substract = function(v2d) {
    if (isNumber(v2d)) {
      v2d = {x: v2d, y: v2d};
    }
    this.x -= v2d.x;
    this.y -= v2d.y;
    return this;
  };
  Vector2D.prototype.multiply = function(v2d) {
    if (isNumber(v2d)) {
      v2d = {x: v2d, y: v2d};
    }
    this.x *= v2d.x;
    this.y *= v2d.y;
    return this;
  };
  Vector2D.prototype.divide = function(v2d) {
    if (isNumber(v2d)) {
      v2d = {x: v2d, y: v2d};
    }
    this.x /= v2d.x;
    this.y /= v2d.y;
    return this;
  };
  
  Vector2D.prototype.length = function(){
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };
  
  Vector2D.prototype.normalize = function(){
    var len = this.length();
    if (len === 0 || len === 1) {
      return this;
    }
    return this.divide(len);
  };
  
  Vector2D.prototype.getAngle = function(){
    return Math.atan2(this.x, -this.y);
  };
  Vector2D.prototype.setAngle = function(angle) {
    this.x = Math.cos(angle);
    this.y = Math.sin(angle);
  };
  
  /* Static methods */
  Vector2D.add = function(v1, v2) {
    if (isNumber(v2)) {
      v2 = {x: v2, y: v2};
    }
    return new Vector2D({x: v1.x + v2.x, y: v1.y + v2.y});
  };
  Vector2D.substract = function(v1, v2) {
    if (isNumber(v2)) {
      v2 = {x: v2, y: v2};
    }
    return new Vector2D({x: v1.x - v2.x, y: v1.y - v2.y});
  };
  Vector2D.multiply = function(v1, v2) {
    if (isNumber(v2)) {
      v2 = {x: v2, y: v2};
    }
    return new Vector2D({x: v1.x * v2.x, y: v1.y * v2.y});
  };
  Vector2D.divide = function(v1, v2) {
    if (isNumber(v2)) {
      v2 = {x: v2, y: v2};
    }
    return new Vector2D({x: v1.x / v2.x, y: v1.y / v2.y});
  };
  Vector2D.equals = function(v1, v2) {
    if (isNumber(v2)) {
      v2 = {x: v2, y: v2};
    }
    return v1.x === v2.x && v1.y === v2.y;
  };
  Vector2D.normalize = function(v) {
    return (new Vector2D(v)).normalize();
  };
  
  /* Expose */
  Math2.isNumber = isNumber;
  Math2.randomInt = randomInt;
  Math2.map = map;
  Math2.Vector2D = Vector2D;
  
  return Math2;
});
