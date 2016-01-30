import * as types from '../constants/ActionTypes';

const initialState = []

export default function reactions(state=initialState, action) {
  switch(action.type) {

    case types.RECEIVE_REACTIONS:
      return [...action.reactions]
    
    default:
      return state
  }
}
