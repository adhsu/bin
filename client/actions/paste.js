import {displayError} from '../actions/environment'
import {changeModal} from '../actions/modal'

function validatePaste(data) {

  const getMediaType = (data) => {

    if (data.indexOf('youtube')!==-1) {
      return 'youtube'
    } else if (data.indexOf('jpg')!==-1 || data.indexOf('png')!==-1 || data.indexOf('jpeg')!==-1) {
      return 'image'
    } else if (data.indexOf('gif')!==-1) {
      return 'gif'
    } else {
      return null
    }
  }

  const isUrl = data.indexOf(" ")==-1 && data.split('.').length >=2
  if (isUrl) {
    const validPost = {
      url: data,
      mediaType: getMediaType(data)
    }
    console.log('valid paste', validPost)
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
