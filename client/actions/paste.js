import {displayError} from '../actions/environment'
import {changeModal} from '../actions/modal'

function getMediaType (data) {
  if (data.indexOf('youtube')!==-1) {
    return 'youtube'
  } else if (data.endsWith('gifv')!==-1 || data.endsWith('webm')!==-1) {
    return 'video'
  } else if (data.endsWith('jpg')!==-1 || data.endsWith('png')!==-1 || data.endsWith('jpeg')!==-1) {
    return 'image'
  } else if (data.endsWith('gif')!==-1) {
    return 'gif'
  } else {
    return null
  }
}

function validateUrl(data) {
  const isUrl = data.indexOf(" ")==-1 && data.split('.').length >=2
  if (isUrl) {
    return data
  } else {
    console.log('Not a valid url')
    return false;
  }
}

export function handlePaste(event=null, queryPaste=null) {
  return dispatch => {
    let url
    if (!queryPaste) {
      const clipboardData = event.clipboardData.getData('text')
      url = validateUrl(clipboardData)
    } else if (queryPaste && queryPaste!=="") {
      url = validateUrl(queryPaste)
    }
    
    if (url) {
      dispatch(changeModal({isOpen: true, url}))
      return null
    } else {
      console.log('Sorry, you did not paste a URL.')
      dispatch(displayError('Sorry, we couldn\'t recognize the URL you pasted.'))
      return null
    } 
  }
}
