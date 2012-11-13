/* Usage:
 *
 * var loop = makeLoop(30, function(){
 * 
 * });
 * 
 * loop.start();
*/
(function(name, definition) {
  if (typeof define == 'function') {
    define(definition);
  } else if (typeof module != 'undefined') {
    module.exports = definition();
  } else {
    this[name] = definition();
  }
})('makeLoop', function(){
  var makeLoop = function(fps, callback, debug){
    var reqAnimId, lastRenderTime, stats, loopFn, loop = {};
    
    if (debug) {
      stats = new Stats();
      loop.stats = stats;
    }
    
    loopFn = function(){
      var now = Date.now();
      
      if (debug) {
        stats.begin();
      }
      
      // Request the next anim frame
      reqAnimId = window.requestAnimationFrame(loopFn);

      // Max fps
      if (lastRenderTime && now - lastRenderTime < 1000 / fps) {
        return;
      }

      callback(now);

      // Save the last rendering time (to lock the max. framerate)
      lastRenderTime = now;
      
      if (debug) {
        stats.end();
      }
    };
    
    loop.start = loopFn;
    loop.stop = function(){
      window.cancelAnimationFrame(reqAnimId);
      lastRenderTime = null;
    };
    
    return loop;
  };
  
  return makeLoop;
});