import * as types from '../constants/ActionTypes';
import update from 'react-addons-update'
import {removeById} from '../helpers/utils'
import {POSTS_PER_PAGE} from '../constants/Config'

const initialState = {
  isFetching: false,
  isCreating: false,
  hasMore: true,
  page: 0,
  items: []

}

export default function posts(state={}, action) {
  switch(action.type) {
    case types.REQUEST_CREATE_POST:
    case types.RECEIVE_CREATE_POST:
    case types.REQUEST_DELETE_POST:
    case types.REQUEST_POSTS:
    case types.RECEIVE_POSTS:
    case types.REQUEST_ADD_REACTION:
    case types.REQUEST_DELETE_REACTION:
      return Object.assign({}, state, {
        [action.binId]: postsInABin(state[action.binId], action)
      })
    default:
      return state
  }
}


function postsInABin(state=initialState, action) {
  switch(action.type) {

    case types.REQUEST_CREATE_POST:
      return Object.assign({}, state, {
        isCreating: true
      })

    case types.RECEIVE_CREATE_POST:
      return update(state, {
        isCreating: {$set: false},
        items: {$unshift: [action.post]}
      })

    case types.REQUEST_DELETE_POST:
      return update(state, {
        items: {$apply: x => removeById(x, action.id)}
      })

    case types.REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true
      })

    case types.RECEIVE_POSTS:
      console.log('receive_posts', action.posts.length, POSTS_PER_PAGE, !(action.posts.length<POSTS_PER_PAGE))
      return update(state, {
        page: {$apply: x=>x+1},
        isFetching: {$set: false},
        hasMore: {$set: !(action.posts.length<POSTS_PER_PAGE)},
        items: {$apply: x => { 
          // check if there are already posts here
          // if so, concat, if not, return the posts
          return x ? x.concat(action.posts) : action.posts
        }}
      })

    case types.REQUEST_ADD_REACTION:
      return update(state, {
        items: {$apply: x => x.map(post => {
          if (post.id == action.postId) {
            if (post.reactions[action.emojiId]) {
              post.reactions[action.emojiId] += 1
            } else {
              post.reactions[action.emojiId] = 1
            }
          }
          return post
        })}
      })

    case types.REQUEST_DELETE_REACTION:
      return update(state, {
        items: {$apply: x => x.map(post => {
          if (post.id == action.postId) {
            if (post.reactions[action.emojiId]==1) {
              delete post.reactions[action.emojiId]
            } else {
              post.reactions[action.emojiId] -= 1
            }
          }
          return post
        })}
      })
    
    default:
      return state
  }
}
