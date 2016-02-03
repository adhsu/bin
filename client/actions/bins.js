import 'whatwg-fetch'
import * as types from '../constants/ActionTypes';
import {API_BASE_URL, API_DELAY} from '../constants/Config'
import {delay} from '../helpers/utils'
import {fetchPosts} from './posts'

function receiveJoinBin(bin) {
  return {
    type: types.RECEIVE_JOIN_BIN,
    bin
  }
}

function receiveJoinBinError(message) {
  return {
    type: types.RECEIVE_JOIN_BIN_ERROR,
    message
  }
}

function receiveBinExists(exists) {
  return {
    type: types.RECEIVE_BIN_EXISTS,
    exists
  }
}

function requestEditBinTitle(binId, title) {
  return {
    type: types.REQUEST_EDIT_BIN_TITLE,
    binId, title
  }
}

export function createBin(binId) {
  return (dispatch, getState) => {
    const {auth} = getState()
    const url = `${API_BASE_URL}/bins/${binId}?auth_token=${auth.token}`
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'}
    }
    return fetch(url, options)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        console.log('created bin, json ', json)
        dispatch(receiveJoinBin(json))
        dispatch(fetchPosts(auth.token, binId))
      })
      .catch(err => { throw err })
  }
}

export function joinBin(binId, invite_code) {
  return (dispatch, getState) => {
    console.log('joinbin', binId, invite_code)
    const {auth} = getState()
    const url = `${API_BASE_URL}/bins/${binId}/join?auth_token=${auth.token}`
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({invite_code})
    }
    return fetch(url, options)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        console.log('joined bin, json ', json)
        if (json.ok) {
          dispatch(receiveJoinBin(json.bin))
          dispatch(fetchPosts(auth.token, binId))
        } else {
          dispatch(receiveJoinBinError(json.message))
        }
        
      })
      .catch(err => { 
        console.log('err is ', err)
        // throw err 
      })
  }
}

export function checkBinExists(binId) {
  return dispatch => {
    return fetch(`${API_BASE_URL}/bins/${binId}`)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        dispatch(receiveBinExists(json.exists))
      })
      .catch(err => { throw err })
  }
}

export function editBinTitle(binId, title) {
  console.log('editing bin title', binId, title)
  return (dispatch, getState) => {
    const {auth} = getState()
    const url = `${API_BASE_URL}/bins/${binId}/title?auth_token=${auth.token}`
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({title})
    }
    dispatch(requestEditBinTitle(binId, title))
    return fetch(url, options)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        console.log('edited bin title', json)
      })
      .catch(err => { throw err })
  }
}
