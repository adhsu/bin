import {displayError} from '../actions/environment'
import {changeModal} from '../actions/modal'


function addProtocol (url) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "//" + url;
  }
  return url;
}

function fixExtension (url) {
  // change imgur gifv to webm for embed
  if (url.indexOf('imgur')>-1 && url.endsWith('gifv')) {
    return url.slice(0, url.lastIndexOf('gifv'))+'webm'
  }
  // change youtube video link to embed
  if (url.indexOf('youtube')>-1 && url.indexOf('embed')==-1) {
    // https://www.youtube.com/watch?v=fb1eeM4tan4
  }
  return url
}

function getMediaType (data) {
  if (data.indexOf('youtube')!==-1) {
    return 'youtube'
  } else if (data.indexOf('gifv')!==-1 || data.indexOf('webm')!==-1) {
    return 'video'
  } else if (data.indexOf('jpg')!==-1 || data.indexOf('png')!==-1 || data.indexOf('jpeg')!==-1) {
    return 'image'
  } else if (data.indexOf('gif')!==-1) {
    return 'gif'
  } else {
    return null
  }
}

function validatePaste(data) {
  const isUrl = data.indexOf(" ")==-1 && data.split('.').length >=2
  data = addProtocol(data)
  data = fixExtension(data)
  if (isUrl) {
    const validPost = {
      url: data,
      mediaType: getMediaType(data)
    }
    return validPost

  } else {
    console.log('not a valid paste')
    return false;
  }
}

export function handlePaste(event) {
  return dispatch => {
    const clipboardData = event.clipboardData.getData('text')
    const validPost = validatePaste(clipboardData)
    
    if (validPost) {
      dispatch(changeModal({
        isOpen: true,
        validPost
      }))
      return null
    } else {
      console.log('Sorry, you did not paste a URL.')
      dispatch(displayError('Sorry, we couldn\'t recognize the URL you pasted.'))
      return null
    } 
  }
}
