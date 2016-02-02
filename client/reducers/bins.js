import * as types from '../constants/ActionTypes';

const initialState = []

export default function bins(state=initialState, action) {
  switch(action.type) {
    case types.RECEIVE_BIN:
      console.log('received a bin ', action)
      return [...state, action.bin]
    case types.RECEIVE_BINS:
      return [...action.bins] // replace all
    
    default:
      return state
  }
}
