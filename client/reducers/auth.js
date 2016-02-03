import * as types from '../constants/ActionTypes';
import update from 'react-addons-update'

const initialState = {
    token: null,
    user: null
}

export default function auth(state=initialState, action) {
  switch(action.type) {

    case types.RECEIVE_AUTH:
      const {user, token} = action
      if (!user.bins) { user.bins=[] }
      return Object.assign({}, state, {
        user, token
      })

    case types.RESET_AUTHED:
      return Object.assign({}, initialState)
    
    case types.RECEIVE_BIN:
      console.log('received bin', action)
      return update(state, {
        user: {
          bins: {$push: [action.bin]}
        }
      })

    default:
      return state
  }
}
