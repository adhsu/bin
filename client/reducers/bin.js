import * as types from '../constants/ActionTypes';
import update from 'react-addons-update'

const initialState = {
  checked: false,
  exists: false,
  error: ""
}

export default function bin(state=initialState, action) {
  switch(action.type) {
    
    case types.RECEIVE_BIN_EXISTS:
      return Object.assign({}, state, {
        checked: true,
        exists: action.exists
      })

    case types.RECEIVE_JOIN_BIN:
      return Object.assign({}, state, {
        checked: true,
        exists: true,
        error: ""
      })
    
    case types.RECEIVE_JOIN_BIN_ERROR:
      return Object.assign({}, state, {
        error: action.message
      })

    default:
      return state
  }
}
