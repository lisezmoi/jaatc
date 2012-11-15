/*jshint browser:true */
define([], function() {
'use strict';

  var document = window.document;

  var hit = function(mX, mY, tX, tY, tW, tH) {
    return mX > tX && mX < tX + tW && mY > tY && mY < tY + tH;
  };

  var hitKey = function(mX, mY, keys){
    var c = keys.measureButtons();
    var dirs = ['up', 'left', 'down', 'right'];
    for (var i = dirs.length - 1; i >= 0; i--) {
      if (hit(mX, mY, c[dirs[i]][0], c[dirs[i]][1], keys.keyWidth, keys.keyHeight)) {
        return [keys[dirs[i]], c[dirs[i]][0], c[dirs[i]][1], dirs[i]];
      }
    }
    return false;
  };

  var drawAlignedLetter = function(ctx, letter, x, y, w) {
    var lw = ctx.measureText(letter).width;
    ctx.fillText(letter, (x + w/2) - (lw/2), y - 5, w);
  };

  var mkInput = function(canv, text, w, h, x, y, cb){
    var input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.value = text.slice(0, 1);

    var styles = {
      textAlign: 'center',
      font: '14px Arial',
      border: '0',
      width: w + 'px',
      height: h + 'px',
      position: 'absolute',
      left: canv.offsetLeft + x + 'px',
      top: canv.offsetTop + y + 'px',
      padding: '0',
      textTransform: 'uppercase'
    };
    for (var i in styles) {
      input.style[i] = styles[i];
    }
    document.body.appendChild(input);
    input.focus();
    input.select();
    var destroy = function(){
      input.onblur = null;
      input.onkeypress = null;
      input.onkeydown = null;
      document.body.removeChild(input);
    };
    input.onblur = destroy;
    var lastKey = 0, lastChar = 0;
    input.onkeypress = function(e){
      lastChar = e.charCode;
    };
    input.onkeydown = function(e){
      if (e.keyCode === 13) { // enter
        cb(lastKey, lastChar);
        destroy();
      } else {
        lastKey = e.keyCode;
      }
    };
    return input;
  };

  var Keys = function(x, y, w, h, m) {
    this.x = x || 0;
    this.y = y || 0;
    this.keyWidth = w || 30;
    this.keyHeight = h || 20;
    this.margin = m || 5;
    this.up = 'W';
    this.left = 'A';
    this.down = 'S';
    this.right = 'D';
    this.codes = {
      up: 87,
      left: 65,
      down: 83,
      right: 68
    };
  };
  Keys.prototype.setKeys = function(keys) {
    var self = this;
    ['up', 'left', 'down', 'right'].forEach(function(dir){
      if (!keys[dir]) { return; }
      self.codes[dir] = keys[dir][0];
      self[dir] = keys[dir][1];
    });
  };
  Keys.prototype.getKeys = function() {
    var self = this, keys = {};
    ['up', 'left', 'down', 'right'].forEach(function(dir){
      keys[dir] = [self.codes[dir], self[dir]];
    });
    return keys;
  };

  Keys.prototype.measureButtons = function() {
    return {
      up: [this.margin + this.x + this.keyWidth, this.y],
      left: [this.x, this.y + this.keyHeight + this.margin],
      down: [this.x + this.keyWidth + this.margin, this.y + this.keyHeight + this.margin],
      right: [this.x + this.keyWidth*2 + this.margin*2, this.y + this.keyHeight + this.margin]
    };
  };

  Keys.prototype.draw = function(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,.3)';

    var c = this.measureButtons();

    ctx.fillRect(c.up[0], c.up[1], this.keyWidth, this.keyHeight);
    ctx.fillRect(c.left[0], c.left[1], this.keyWidth, this.keyHeight);
    ctx.fillRect(c.down[0], c.down[1], this.keyWidth, this.keyHeight);
    ctx.fillRect(c.right[0], c.right[1], this.keyWidth, this.keyHeight);

    ctx.fillStyle = 'rgba(0,0,0,.6)';
    ctx.font = '14px Arial';

    drawAlignedLetter(ctx, this.up, c.up[0], c.up[1] + this.keyHeight, this.keyWidth);
    drawAlignedLetter(ctx, this.left, c.left[0], c.left[1] + this.keyHeight, this.keyWidth);
    drawAlignedLetter(ctx, this.down, c.down[0], c.down[1] + this.keyHeight, this.keyWidth);
    drawAlignedLetter(ctx, this.right, c.right[0], c.right[1] + this.keyHeight, this.keyWidth);
  };
  Keys.prototype.bindStore = function(store) {
    if (store.enabled) {
      var storedKeys = store.get('keys');
      if (storedKeys) {
        this.setKeys(storedKeys);
      }
      this.store = store;
    }
  };

  Keys.prototype.bindClick = function(canvas) {
    var self = this;
    canvas.addEventListener('click', function(e){
      var x = e.clientX - canvas.offsetLeft;
      var y = e.clientY - canvas.offsetTop;
      var hit = hitKey(x, y, self);
      if (hit) {
        mkInput(canvas, hit[0], self.keyWidth, self.keyHeight, hit[1], hit[2],
          function(keyCode, charCode){
            if (keyCode) {
              self[hit[3]] = String.fromCharCode(keyCode).toUpperCase();
              self.codes[hit[3]] = keyCode;
              if (self.store) {
                self.store.set('keys', self.getKeys());
              }
            }
          });
      }
    }, false);
  };

  return Keys;
});