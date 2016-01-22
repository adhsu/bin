export function createLookupObj (array, key='id') {
  const lookup = {};
  console.log('key is ', key)
  for (var i = 0, len = array.length; i < len; i++) {
      lookup[array[i][key]] = array[i];
  }
  return lookup
}

export function findById (sourceArray, id) {
  for (var i = 0; i < sourceArray.length; i++) {
    if (sourceArray[i].id === id) {
      return sourceArray[i];
    }
  }
  throw "Couldn't find object with id: " + id;
}

// ripped from underscore.js

const _now = Date.now || function() {
  return new Date().getTime();
};

export function _throttle(func, wait, options) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  if (!options) options = {};
  var later = function() {
    previous = options.leading === false ? 0 : _now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };
  return function() {
    var now = _now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
};
