import 'whatwg-fetch'
import * as types from './actionTypes';

function requestTitle(url) {
  return {
    type: types.REQUEST_TITLE,
    url
  }
}

function receiveTitle(url, json) {
  return {
    type: types.RECEIVE_TITLE,
    url,
    data: json,
    receivedAt: Date.now()
  }
}

// thunk
export function fetchTitle(url) {
  return dispatch => {
    dispatch(requestTitle(url))

    return setTimeout( ()=> {
      
      return fetch(`http://10.0.1.187:3000/api/title/?url=${url}`)
        .then(response => response.json())
        .then(json => {
          console.log('fetchTitle ', url, json)
          return dispatch(receiveTitle(url, json))
        })
    }, 500)
  }
}