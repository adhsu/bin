import 'whatwg-fetch'
import * as types from '../constants/ActionTypes';
import {API_BASE_URL, API_DELAY} from '../constants/Config'
import {delay} from '../helpers/utils'


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
  
    return fetch(`${API_BASE_URL}/title/?url=${url}`)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        console.log('fetchTitle ', url, json)
        return dispatch(receiveTitle(url, json))
      })
  }
}