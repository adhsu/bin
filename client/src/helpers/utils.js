export function limitText(text, lim) {
  if (!text) {return;}
  if (lim < text.length) {
    return text.substring(0, text.lastIndexOf(' ', lim))+'...'
  } else {
    return text
  }
}

export function addProtocol (url) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "http://" + url;
  }
  return url;
}

export function getSpotifyId(url) {
  // spotify:track:2TpxZ7JUBn3uw46aR7qd6V or http://open.spotify.com/track/2TpxZ7JUBn3uw46aR7qd6V

  if (url.indexOf('spotify')>-1) {
    const lastColon = url.lastIndexOf(':')
    const lastSlash = url.lastIndexOf('/')
    if (lastSlash>lastColon) {
      return url.slice(lastSlash+1)
    } else {
      return url.slice(lastColon+1)
    }
  } else {
    return 'error'
  }
}

export function getImgurId(url) {
  const lastSlash = url.lastIndexOf('/')
  const lastDot = url.lastIndexOf('.')
  if (lastSlash<lastDot) {
    url = url.slice(lastSlash+1, lastDot)
  } else {
    url = url.slice(lastSlash+1)
  }
  return url
}

function getYoutubeId(url) {
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[2].length == 11) {
      return match[2];
  } else {
      return 'error';
  }
}

export function fixYoutubeUrl (url) {
  if ((url.indexOf('youtube')>-1 || url.indexOf('youtu.be')>-1) && url.indexOf('embed')==-1) {
    return `http://youtube.com/embed/${getYoutubeId(url)}`
  }
  return url
}


export function scrolledToBottom(offset=0) {
  const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
  const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight
  const scrolledToBottom = (scrollTop + window.innerHeight) >= scrollHeight-offset
  return scrolledToBottom
}

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

export function _debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};