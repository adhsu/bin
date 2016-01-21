import 'whatwg-fetch'
import * as types from './actionTypes';
import {API_BASE_URL} from './../config'


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
      
      return fetch(`${API_BASE_URL}/title/?url=${url}`)
        .then(response => response.json())
        .then(json => {
          console.log('fetchTitle ', url, json)
          return dispatch(receiveTitle(url, json))
        })
    }, 500)
  }
}