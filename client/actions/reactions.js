import 'whatwg-fetch'
import * as types from '../constants/ActionTypes';
import {API_BASE_URL, API_DELAY} from '../constants/Config'
import {delay} from '../helpers/utils'

function receiveReactions(reactions) {
  return {
    type: types.RECEIVE_REACTIONS,
    reactions
  }
}

export function fetchReactions(token) {
  return dispatch => {
    if (token=='butts') {
      const fakeReactions = []
      dispatch(receiveReactions(fakeReactions))  
    }
  }
}

function requestToggleReaction(userId, postId, emojiId, binSlug) {
  return {
    type: types.REQUEST_TOGGLE_REACTION,
    userId, postId, emojiId, binSlug
  }
}

function receiveToggleReaction(userId, postId, emojiId, binSlug, json) {
  return {
    type: types.RECEIVE_TOGGLE_REACTION,
    userId, postId, emojiId, binSlug,
    data: json,
    receivedAt: Date.now()
  }
}

// thunk
export function toggleReaction(userId, postId, emojiId, binSlug) {
  
  const init = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({userId, postId, emojiId})
  }
  const apiUrl = API_BASE_URL + "/posts/toggleReaction"

  return dispatch => {
    dispatch(requestToggleReaction(userId, postId, emojiId, binSlug))
    
      
    return fetch(apiUrl, init)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        console.log('toggle reaction ', userId, postId, emojiId, binSlug, json)
        return dispatch(receiveToggleReaction(userId, postId, emojiId, binSlug, json))
      })
  }
}
