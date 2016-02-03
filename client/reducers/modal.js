import * as types from '../constants/ActionTypes';
import update from 'react-addons-update'

const initialState = {
  isOpen: false,
  isLoadingTitle: false,
  fetchedTitle: "",
  validPost: null
}

export default function modal(state=initialState, action) {
  switch(action.type) {
    
    case types.RESET_MODAL:
      return Object.assign({}, initialState)

    case types.CHANGE_MODAL:
      return update(state, {
        isOpen: {$set: action.modal.isOpen},
        validPost: {$set: action.modal.validPost}
      })

    case types.REQUEST_TITLE:
      return Object.assign({}, state, {
        isLoadingTitle: true
      })

    case types.RECEIVE_TITLE:
      console.log('receive title', action)
      return Object.assign({}, state, {
        isLoadingTitle: false,
        fetchedTitle: action.title
      })

    default:
      return state
  }
}
