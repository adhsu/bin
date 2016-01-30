import * as types from '../constants/ActionTypes';
import {API_BASE_URL, API_DELAY} from '../constants/Config'
import {delay} from '../helpers/utils'

function requestNewPost(post) {
  return {
    type: types.REQUEST_NEW_POST,
    post
  }
}

function receiveNewPost(post, json) {
  return {
    type: types.RECEIVE_NEW_POST,
    post,
    data: json,
    receivedAt: Date.now()
  }
}

// thunk

export function submitNewPost(post) {
  const {binSlug, url, title, mediaType, author} = post
  const init = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(post)
  }
  const apiUrl = API_BASE_URL + "/posts/create"

  return dispatch => {
    dispatch(requestNewPost(post))
  
    return fetch(apiUrl, init)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        return dispatch(receiveNewPost(post, json))
      })
  }
}