import * as types from '../constants/ActionTypes';
import update from 'react-addons-update'
const initialState = {
  isOpen: false,
  isLoadingMeta: false,
  meta: null,
  mediaType: null,
  url: null,
  api: null
}

export default function modal(state=initialState, action) {
  switch(action.type) {
    
    case types.RESET_MODAL:
      return Object.assign({}, initialState)

    case types.CHANGE_MODAL:
      return update(state, {
        isOpen: {$set: action.modal.isOpen || state.isOpen},
        // mediaType: {$set: action.modal.mediaType || state.mediaType},
        url: {$set: action.modal.url || state.url}
      })

    case types.REQUEST_META:
      return Object.assign({}, state, {
        isLoadingMeta: true
      })

    case types.RECEIVE_META:
      const mediaType = getMediaType(action.url, action.meta, action.api)
      console.log('mediatype is ', mediaType)
      return Object.assign({}, state, {
        isLoadingMeta: false,
        meta: action.meta,
        mediaType: mediaType,
        api: action.api
      })

    default:
      return state
  }
}

function getMediaType(url, meta, api) {
  if (api=='imgur') {
    if (!meta.animated) { 
      return 'image' 
    } else {
      return 'video'
    }
    if (meta.images_count) { return 'album' }
  } else {
    if (url.endsWith('jpg') || url.endsWith('jpeg') || url.endsWith('png')) {
      return 'image'
    } else if (url.endsWith('gif')) {
      return 'gif'
    } else if (url.indexOf('youtube')!==-1) {
      return 'youtube'
    } else {
      return 'link'
    }
  }
  return 'link'
}