import * as types from '../constants/ActionTypes';
import update from 'react-addons-update'


const initialState = {
  isFetching: false,
  items: {
  }
}

export default function posts(state=initialState, action) {
  switch(action.type) {

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
