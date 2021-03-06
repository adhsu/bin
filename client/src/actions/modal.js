import 'whatwg-fetch'
import * as types from '../constants/ActionTypes';
import {API_BASE_URL, 
  API_DELAY, 
  IMGUR_IMAGE_API, 
  IMGUR_ALBUM_API, 
  IMGUR_HEADER} from '../constants/Config'
import {getImgurId} from '../helpers/utils'


export function changeModal (modal) {
  return {
    type: types.CHANGE_MODAL,
    modal
  }
}

function requestMeta() {
  return {
    type: types.REQUEST_META
  }
}

function receiveMeta(url, meta, api="self") {
  console.log('receive meta action', url, meta, api)
  return {
    type: types.RECEIVE_META,
    url,
    meta,
    api
  }
}

export function resetModal() {
  return {
    type: types.RESET_MODAL
  }
}

export function fetchMeta (url) {
  return dispatch => {
    
    const apiUrl = `${API_BASE_URL}/title`
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({url})
    }

    dispatch(requestMeta())

    if (url.indexOf('imgur')>-1) {
      console.log('fetching meta from imgur api')
      const isAlbum = url.indexOf('/a/')>-1
      const imgurId = getImgurId(url)
      return fetch(
        (isAlbum ? IMGUR_ALBUM_API : IMGUR_IMAGE_API)+imgurId, {
          headers: { 'Authorization': IMGUR_HEADER }
        })
        .then(response => response.json())
        .then(json => {
          console.log('fetchMeta from imgur', json)
          if (json.success) {
            dispatch(receiveMeta(url, json.data, "imgur"))
          } else {
            dispatch(receiveMeta(url, {}, "imgur"))
          }
        })
        .catch(error => {
          dispatch(receiveMeta(url, {}))
          console.log('error with fetch meta: ', error.message)
        })
    } else {
      console.log('fetching meta from self api')
      return fetch(apiUrl, options)
        .then(response => response.json())
        .then(json => {
          if (json.ok=='true') {
            dispatch(receiveMeta(url, json.data))
          } else {
            dispatch(receiveMeta(url, {}))
          }
        })
        .catch(error => {
          console.log('error with fetch meta: ', error.message)
          dispatch(receiveMeta(url, {}))
        })
    }

  }
}
