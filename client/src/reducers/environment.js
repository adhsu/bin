import * as types from '../constants/ActionTypes';

const initialState = {
  error: "",
  isMobile: false,
  height: null,
  width: null
}

export default function environment(state=initialState, action) {
  switch(action.type) {

    case types.DISPLAY_ERROR:
      return Object.assign({}, state, {
        error: action.message
      })

    case types.CHANGE_IS_MOBILE:
      return Object.assign({}, state, {
        isMobile: action.isMobile
      })

    case types.CHANGE_WIDTH_AND_HEIGHT:
      return Object.assign({}, state, {
        height: action.height,
        width: action.width
      })
    
    default:
      return state
  }
}
