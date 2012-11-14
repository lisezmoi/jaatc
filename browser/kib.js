/*jshint browser:true */
(function(name, definition) {
  if (typeof define == 'function') {
    define(definition);
  } else if (typeof module != 'undefined') {
    module.exports = definition();
  } else {
    this[name] = definition();
  }
})('kib', function(){
  'use strict';
  
  var ALIASES = {
    'left': 37,
    'up': 38,
    'right': 39,
    'down': 40,
    'space': 32,
    'escape': 27,
    'enter': 13
  };
  var activeKeys = [];
  var listeners = {};

  var aliasToKey = function(key){
    return ALIASES[key] || key;
  };

  var executingListeners = false;
  var afterExec = [];
  var execListeners = function(key, e){
    executingListeners = true;
    if (listeners[key]) {
      var toRemove = [];
      var len = listeners[key].length;
      for (var i=0; i < len; i++) {
        // Once
        if (listeners[key][i]._kibOne) {
          toRemove.push(listeners[key][i]);
        }
        listeners[key][i](e);
      }
      // Clear once
      if (listeners[key]) {
        for (var j = toRemove.length - 1; j >= 0; j--) {
          listeners[key].splice(listeners[key].indexOf(toRemove[j]), 1);
          delete toRemove[j]._kibOne;
        }
      }
      toRemove = null;
    }
    executingListeners = false;
    for (var k = afterExec.length - 1; k >= 0; k--){
      afterExec[k]();
    }
    afterExec = [];
  };

  var events = {
    keydown: function(e){
      if (activeKeys.indexOf(e.keyCode) === -1) {
        activeKeys.push(e.keyCode);
      }
      execListeners(e.keyCode, e);
    },
    keyup: function(e){
      if (activeKeys.indexOf(e.keyCode) > -1) {
        activeKeys.splice(activeKeys.indexOf(e.keyCode), 1);
      }
    },
    blur: function(e){
      activeKeys = [];
    }
  };

  var bound = false;
  var bindEvents = function(){
    if (!bound) {
      for (var i in events) if (events.hasOwnProperty(i)) {
        window.addEventListener(i, events[i], false);
      }
    }
    bound = true;
  };
  var unbindEvents = function(){
    for (var i in events) if (events.hasOwnProperty(i)) {
      window.removeEventListener(i, events[i], false);
    }
    activeKeys = [];
    bound = false;
  };

  var isKeyActive = function(key) {
    return activeKeys.indexOf(aliasToKey(key)) > -1;
  };

  var on = function(key, cb, one) {
    key = aliasToKey(key);
    if (!listeners[key]) {
      listeners[key] = [];
    }
    listeners[key].push(cb);
  };
  var off = function(key, cb) {
    if (executingListeners) {
      afterExec.push(function(){
        off(key, cb);
      });
      return;
    }
    key = aliasToKey(key);
    if (!listeners[key]) {
      return;
    }
    if (!cb) {
      delete listeners[key];
    } else if (listeners[key].indexOf(cb) > -1) {
      listeners[key].splice(listeners[key].indexOf(cb), 1);
      if (!listeners[key].length) { // delete if empty
        delete listeners[key];
      }
    }
  };

  var one = function(key, cb) {
    cb._kibOne = true;
    on(key, cb);
  };

  return {
    start: bindEvents,
    stop: unbindEvents,
    keys: activeKeys,
    key: isKeyActive,
    on: on,
    off: off,
    one: one
  };
});
