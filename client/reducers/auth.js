import * as types from '../constants/ActionTypes';

const initialState = {
    token: null,
    user: null
}

export default function auth(state=initialState, action) {
  switch(action.type) {

    case types.RECEIVE_AUTHED_USER:
      return Object.assign({}, state, {
        user: action.user
      })

    case types.RESET_AUTHED:
      return Object.assign({}, initialState)

    case types.RECEIVE_TOKEN:
      return Object.assign({}, state, {
        token: action.token
      })
    
    default:
      return state
  }
}
