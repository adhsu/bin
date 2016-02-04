import {displayError} from '../actions/environment'
import {changeModal} from '../actions/modal'

function validateUrl(data) {
  const isUrl = data.indexOf(" ")==-1 && data.split('.').length >=2
  const isSpotify = data.indexOf('spotify')>-1
  if (isUrl || isSpotify) {
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
