import * as types from './actionTypes';
import {API_BASE_URL} from './../config'


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
  console.log('gogogo post is ', post)
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

    return setTimeout( ()=> {
      
      return fetch(apiUrl, init)
        .then(response => response.json())
        .then(json => {
          console.log('submitNewPost ', post, json)
          return dispatch(receiveNewPost(post, json))
        })
    }, 500)
  }
}