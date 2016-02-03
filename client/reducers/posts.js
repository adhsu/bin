import * as types from '../constants/ActionTypes';
import update from 'react-addons-update'
import {removeById} from '../helpers/utils'

const initialState = {
  isFetching: false,
  isCreating: false,
  items: {
  }
}

export default function posts(state=initialState, action) {
  switch(action.type) {

    case types.REQUEST_CREATE_POST:
      return Object.assign({}, state, {
        isCreating: true
      })

    case types.RECEIVE_CREATE_POST:
      return update(state, {
        isCreating: {$set: false},
        items: {
          [action.post.binId]: {$unshift: [action.post]}
        }
      })

    case types.REQUEST_DELETE_POST:
      return update(state, {
        items: {
          [action.binId]: {$apply: x => removeById(x, action.id)}
        }
      })

    case types.REQUEST_POSTS:
      return Object.assign({}, state, {
        isFetching: true
      })

    case types.RECEIVE_POSTS:
      return update(state, {
        isFetching: {$set: false},
        items: {
          [action.binId]: {$apply: x => { 
            // check if there are already posts here
            // if so, concat, if not, return the posts
            return x ? x.concat(action.posts) : action.posts
          }}
        }
      })
    
    default:
      return state
  }
}
