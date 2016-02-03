import 'whatwg-fetch'
import * as types from '../constants/ActionTypes'
import {API_BASE_URL, API_DELAY} from '../constants/Config'
import {checkStatus, delay, encodeQueryData} from '../helpers/utils'
import {resetModal} from '../actions/modal'

function requestCreatePost(binId) {
  return {
    type: types.REQUEST_CREATE_POST,
    binId
  }
}

function receiveCreatePost(post, binId) {
  return {
    type: types.RECEIVE_CREATE_POST,
    post, binId
  }
}

function requestDeletePost(id, binId) {
  return {
    type: types.REQUEST_DELETE_POST,
    id, binId
  }
}

function requestPosts(binId) {
  return {
    type: types.REQUEST_POSTS,
    binId
  }
}

function receivePosts(posts, binId) {
  return {
    type: types.RECEIVE_POSTS,
    posts, binId
  }
}



export function fetchPosts(token, binId, lastViewed=Date.now(), offset=0, limit=3) {
  console.log('actions/fetchPosts for bin ', binId)
  return dispatch => {
    dispatch(requestPosts(binId))

    const qs = encodeQueryData({
      auth_token: token,
      binId,
      lastViewed, offset, limit
    })

    return fetch(API_BASE_URL + '/posts?' + qs)
      .then(delay(API_DELAY))
      .then(checkStatus)
      .then(response => response.json())
      .then(json => {
        return dispatch(receivePosts(json, binId))
      })
      .catch(err => { throw err })
  }
}

export function fetchPostsIfNeeded(binId) {
  return (dispatch, getState) => {
    const {auth, posts} = getState()
    if (shouldFetchPosts(posts, binId)) {
      console.log('should fetch posts')
      dispatch(fetchPosts(auth.token, binId))
    }
    console.log('not needed')
  }
}

function shouldFetchPosts(posts, binId) {
  const postsInBin = posts[binId]
  if (!postsInBin) {
    return true
  }
  return false
}

export function createPost(post) {
  return (dispatch, getState) => {
    const {auth} = getState()
    const {binId, url, title, mediaType} = post
    const apiUrl = `${API_BASE_URL}/posts?auth_token=${auth.token}`
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    }
    
    dispatch(requestCreatePost(binId))
    return fetch(apiUrl, options)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        console.log('received ', json)
        dispatch(receiveCreatePost(json, binId))
        dispatch(resetModal())
      })
      .catch(err => { throw err })
  }
}

export function deletePost(id, binId) {
  return (dispatch, getState) => {
    const {auth} = getState()
    const url = `${API_BASE_URL}/posts/${id}?auth_token=${auth.token}`
    const options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }

    dispatch(requestDeletePost(id, binId))
    return fetch(url, options)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        console.log('deleted post ', binId, id, json)
      })
      .catch(err => { throw err })
  }
}
