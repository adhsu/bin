import 'whatwg-fetch'
import * as types from './actionTypes';
import {API_BASE_URL} from './../config'


function requestBins(userId) {
  return {
    type: types.REQUEST_BINS,
    userId
  }
}

function receiveBins(userId, json) {
  return {
    type: types.RECEIVE_BINS,
    userId,
    data: json,
    receivedAt: Date.now()
  }
}

// thunk
export function fetchBins(userId) {
  return dispatch => {
    dispatch(requestBins(userId))

    return setTimeout( ()=> {
      
      return fetch(`${API_BASE_URL}/bins/get?userId=${userId}`)
        .then(response => response.json())
        .then(json => {
          console.log('fetchTitle ', userId, json)
          return dispatch(receiveBins(userId, json))
        })
    }, 500)
  }
}