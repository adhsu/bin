export function parseQueryString(queryString) {
  const qsObj = {}
  if (queryString[0]=='?') {
    queryString = queryString.substring(1)
  }
  const splitArr = queryString.split("&")
  splitArr.map(piece => {
    const [key, val] = piece.split('=')
    qsObj[key] = val
  })
  return qsObj
}

export function encodeQueryData(data) {
    return Object.keys(data).map(key => {
        return [key, data[key]].map(encodeURIComponent).join("=")
    }).join("&")
}

export function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export function delay (milliseconds) {
  return result => {
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        resolve(result)
      }, milliseconds)
    })
  }
}

export function createLookupObj (array, key='id') {
  const lookup = {};
  for (var i = 0, len = array.length; i < len; i++) {
      lookup[array[i][key]] = array[i];
  }
  return lookup
}

export function removeById (sourceArray, id) {
  for (var i = 0; i < sourceArray.length; i++) {
    if (sourceArray[i].id === id) {
      sourceArray.splice(i, 1)
      return sourceArray
    }
  }
  return false
}

export function findById (sourceArray, id) {
  for (var i = 0; i < sourceArray.length; i++) {
    if (sourceArray[i].id === id) {
      return sourceArray[i];
    }
  }
  // throw "Couldn't find object with id: " + id;
  return false
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

export function sortArr (arr) {
  return arr.sort( (a,b)=> b-a )
}