import 'whatwg-fetch'
import * as types from '../constants/ActionTypes';
import {API_BASE_URL, API_DELAY} from '../constants/Config'
import {delay} from '../helpers/utils'

function requestAddReaction(userId, postId, emojiId, binId) {
  return {
    type: types.REQUEST_ADD_REACTION,
    userId, postId, emojiId, binId
  }
}

function requestDeleteReaction(userId, postId, emojiId, binId) {
  return {
    type: types.REQUEST_DELETE_REACTION,
    userId, postId, emojiId, binId
  }
}

function receiveReactions(reactions) {
  return {
    type: types.RECEIVE_REACTIONS,
    reactions
  }
}

export function addReaction(binId, postId, emojiId) {
  return (dispatch, getState) => {
    const {auth} = getState()
    const url = `${API_BASE_URL}/reactions/${binId}/${postId}/${emojiId}?auth_token=${auth.token}`
    const options = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'}
    }
    dispatch(requestAddReaction(auth.user.id, postId, emojiId, binId))
    return fetch(url, options)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        console.log('added reaction ', json)
      })
      .catch(err => { throw err })
  }
}

export function deleteReaction(binId, postId, emojiId) {
  return (dispatch, getState) => {
    const {auth} = getState()
    const url = `${API_BASE_URL}/reactions/${binId}/${postId}/${emojiId}?auth_token=${auth.token}`
    const options = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    }
    dispatch(requestDeleteReaction(auth.user.id, postId, emojiId, binId))
    return fetch(url, options)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        console.log('deleted reaction ', json)
      })
      .catch(err => { throw err })
  }
}


export function fetchReactions(token) {
  return dispatch => {

    return fetch(`${API_BASE_URL}/reactions?auth_token=${token}`)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        dispatch(receiveReactions(json))
      })
      .catch(err => { throw err })

  }
}