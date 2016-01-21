import 'whatwg-fetch'
import * as types from './actionTypes';
import {API_BASE_URL} from './../config'

function requestPosts(slug) {
  return {
    type: types.REQUEST_POSTS,
    slug
  }
}

function receivePosts({slug, userId, page, postsPerPage}, json) {
  return {
    type: types.RECEIVE_POSTS,
    params: {slug, userId, page, postsPerPage},
    // posts: json.data.children.map(child => child.data),
    posts: json,
    receivedAt: Date.now()
  }
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

// thunk
export function fetchPosts({slug, userId, page, postsPerPage}) {
  return dispatch => {
    dispatch(requestPosts(slug))

    return setTimeout( ()=> {
      
      return fetch(`${API_BASE_URL}/posts/get?binSlug=${slug}&userId=${userId}&pageNum=${page}&postsPerPage=${postsPerPage}`)
        .then(checkStatus)
        .then(response => {
          return response.json()
        })
        .then(json => {
          console.log('fetchPosts: ', {slug, userId, page, postsPerPage}, json)
          return dispatch(receivePosts({slug, userId, page, postsPerPage}, json))
        })
        .catch(error => {
          console.log('error: ', error.message)
        })
    }, 1500)
  }
}

function shouldFetchPosts(state, slug) {
  const postsInBin = state.posts[slug]
  if (!postsInBin) {
    return true
  } else {
    return false
  }
}

export function fetchPostsIfNeeded({slug, userId, page, postsPerPage}) {
  return (dispatch, getState) => {
    if (shouldFetchPosts(getState(), slug)) {
      return dispatch(fetchPosts({slug, userId, page, postsPerPage}))
    }
  }
}

function requestDeletePost(binSlug, id, index) {
  return {
    type: types.REQUEST_DELETE_POST,
    binSlug, id, index
  }
}

function receiveDeletePost(binSlug, id, index, json) {
  return {
    type: types.RECEIVE_DELETE_POST,
    binSlug, id, index,
    data: json,
    receivedAt: Date.now()
  }
}

// thunk
export function deletePost(binSlug, id, index) {
  
  const init = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({id})
  }
  const apiUrl = API_BASE_URL + "/posts/delete"

  return dispatch => {
    dispatch(requestDeletePost(binSlug, id, index))
    // return dispatch(receiveDeletePost(binSlug, id, index, []))
    return setTimeout( ()=> {
      
      return fetch(apiUrl, init)
        .then(response => response.json())
        .then(json => {
          console.log('delete post ', binSlug, id, index, json)
          return dispatch(receiveDeletePost(binSlug, id, index, json))
        })
    }, 500)
  }
}