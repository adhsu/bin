import * as types from '../constants/ActionTypes';
import update from 'react-addons-update'

const initialState = {
    token: null,
    user: null,
    authLoading: true
}

export default function auth(state=initialState, action) {
  switch(action.type) {
    case types.REQUEST_AUTH:
      return Object.assign({}, state, {
        authLoading: true
      })

    case types.RECEIVE_AUTH:
      const {user, token} = action
      if (user && !user.bins) { user.bins=[] }
      return Object.assign({}, state, {
        user, 
        token,
        authLoading: false
      })

    case types.RESET_AUTHED:
      return Object.assign({}, initialState, {
        authLoading: false
      })
    
    case types.RECEIVE_JOIN_BIN:
      console.log('received join_bin', action)
      return update(state, {
        user: {
          bins: {$push: [action.bin]}
        }
      })

    case types.REQUEST_EDIT_BIN_TITLE:
      console.log('reducer edit title', action)
      return update(state, {
        user: {
          bins: {$apply: x => x.map(bin => {
            if (bin.id==action.binId) {
              bin.title = action.title
            }
            return bin
          })} 
        }
      })

    case types.RECEIVE_POSTS:
      let lastTimestamp
      if (action.posts.length>0) {
        lastTimestamp = action.posts[action.posts.length-1].createdAt
      } else {
        lastTimestamp = Date.now()
      }
      return update(state, {
        user: {
          bins: {$apply: x => x.map(bin => {
            if (bin.id==action.binId) {
              bin.lastTimestamp = lastTimestamp
            }
            return bin
          })} 
        }
      })
      

    default:
      return state
  }
}
