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
      console.log('requesting meta')
      return Object.assign({}, state, {
        isLoadingMeta: true
      })

    case types.RECEIVE_META:
      const mediaType = getMediaType(action.url, action.meta, action.api)
      console.log('mediatype is ', mediaType, action)
      
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
  console.log('getmediatype', url, meta, api)
  if (url && api) {
    if (api=='imgur' && meta) {
      if (!meta.animated) { 
        return meta.images_count ? 'album' : 'image'
      } else {
        return 'video'
      }
    } else {
      if (url.endsWith('jpg') || url.endsWith('jpeg') || url.endsWith('png')) {
        return 'image'
      } else if (url.endsWith('gif')) {
        return 'gif'
      } else if (url.indexOf('youtube')>-1 || url.indexOf('youtu.be')>-1) {
        return 'youtube'
      } else if (url.indexOf('vimeo')>-1) {
        return 'vimeo'
      } else if (url.indexOf('spotify')>-1) {
        return 'spotify'
      } else if (url.indexOf('soundcloud')>-1) {
        return 'soundcloud'
      } else {
        return 'link'
      }
    }
  }
  
  return 'link'
}