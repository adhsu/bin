import 'whatwg-fetch'
import * as types from '../constants/ActionTypes'
import {API_BASE_URL, API_DELAY} from '../constants/Config'
import {checkStatus, delay, encodeQueryData} from '../helpers/utils'
import {resetModal} from '../actions/modal'

function requestPosts() {
  return {
    type: types.REQUEST_POSTS
  }
}

function receivePosts(posts, binId) {
  return {
    type: types.RECEIVE_POSTS,
    posts, binId
  }
}

function requestCreatePost() {
  return {
    type: types.REQUEST_CREATE_POST
  }
}

function receiveCreatePost(post) {
  return {
    type: types.RECEIVE_CREATE_POST,
    post
  }
}

function requestDeletePost(id, binId) {
  return {
    type: types.REQUEST_DELETE_POST,
    id, binId
  }
}

export function fetchPosts(token, binId) {
  console.log('actions/fetchPosts for bin ', binId)
  return dispatch => {
    dispatch(requestPosts())

    const qs = encodeQueryData({
      auth_token: token,
      binId,
      lastViewed: 1453430821034,
      offset: 0,
      limit: 10
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
      dispatch(fetchPosts(auth.token, binId))
    }
  }
}

function shouldFetchPosts(posts, binId) {
  const postsInBin = posts.items[binId]
  if (!postsInBin && !posts.isFetching) {
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
    
    dispatch(requestCreatePost())
    return fetch(apiUrl, options)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        console.log('received ', json)
        dispatch(receiveCreatePost(json))
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
