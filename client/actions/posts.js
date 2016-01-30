import 'whatwg-fetch'
import * as types from '../constants/ActionTypes'
import {API_BASE_URL, API_DELAY} from '../constants/Config'
import {checkStatus, delay, encodeQueryData} from '../helpers/utils'

function requestPosts() {
  return {
    type: types.REQUEST_POSTS
  }
}

function receivePosts(binId, posts) {
  return {
    type: types.RECEIVE_POSTS,
    binId,
    posts
  }
}

export function fetchPosts(token, binId) {
  console.log('actions/fetchPosts for bin ', binId)
  return dispatch => {
    dispatch(requestPosts())

    if (token=='butts') {
      const fakePostsFell = [
        {
          id: '0',
          author: '0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216',
          binId: 'fell',
          title: "One of my favourite things about working in the ski fields",
          url: "https://i.imgur.com/hWwlWgI.jpg",
          createdAt: 1454012406446,
          mediaType: "image",
          reactions: {}
        },
        {
          id: '1',
          author: '0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216',
          binId: 'fell',
          title: "Someone at this museum has a sense of humor",
          url: "https://i.imgur.com/77beSl9.jpg",
          createdAt: 1454012406446,
          mediaType: "image",
          reactions: {}
        }
      ]

      const fakePostsSouthPark = [
        // {
        //   id: '2',
        //   author: '0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216',
        //   binId: 'southpark',
        //   title: "A funny aww photo 1",
        //   url: "https://i.imgur.com/OVvEDw9.jpg",
        //   createdAt: 1454012406446,
        //   mediaType: "image",
        //   reactions: {}
        // },
        // {
        //   id: '3',
        //   author: '0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216',
        //   binId: 'southpark',
        //   title: "A funny aww photo 2",
        //   url: "https://i.imgur.com/q8slPRA.jpg",
        //   createdAt: 1454012406446,
        //   mediaType: "image",
        //   reactions: {}
        // }
      ]

      if (binId=='fell') {
        setTimeout(()=> {
          dispatch(receivePosts(binId, fakePostsFell))
        }, API_DELAY)
      } else if (binId=='southpark') {
        setTimeout(()=> {
          dispatch(receivePosts(binId, fakePostsSouthPark))
        }, API_DELAY)
      } else {
        setTimeout(()=> {
          dispatch(receivePosts(binId, []))
        }, API_DELAY)
      }
    }

    // const qs = encodeQueryData({
    //   token, binId,
    //   lastViewed: 1453430821034,
    //   offset: 0,
    //   limit: 10
    // })

    // return fetch(API_BASE_URL + '/posts?' + qs)
    //   .then(delay(API_DELAY))
    //   .then(checkStatus)
    //   .then(response => response.json())
    //   .then(json => {
    //     return dispatch(receivePosts(binId, json))
    //   })
    //   .catch(err => { throw err })
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



function requestDeletePost(binId, id) {
  return {
    type: types.REQUEST_DELETE_POST,
    binId, id
  }
}

export function deletePost(binId, id) {
  return (dispatch, getState) => {
    const {auth} = getState()
    const url = `${API_BASE_URL}/posts/${id}?token=${auth.token}`
    const options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    }

    dispatch(requestDeletePost(binId, id))
    return fetch(url, options)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        console.log('deleted post ', json)
      })
      .catch(err => { throw err })
  }
}
