import * as types from '../constants/ActionTypes';
import update from 'react-addons-update'
import {createLookupObj} from '../helpers/utils'

const initialState = {}

export default function reactions(state=initialState, action) {
  switch(action.type) {

    case types.RECEIVE_REACTIONS:
      return createLookupObj(action.reactions)

    case types.REQUEST_ADD_REACTION:
      const reactionId = `${action.userId}_${action.postId}_${action.emojiId}`
      const reactionObj = {
        id: reactionId,
        userId: action.userId,
        postId: action.postId,
        emojiId: action.emojiId
      }

      console.log('REQUEST_ADD_REACTION reactionId', reactionObj)

      return update(state, {
        [reactionId]: {$set: reactionObj}
      })

    case types.REQUEST_DELETE_REACTION:
      const reactionId2 = `${action.userId}_${action.postId}_${action.emojiId}`
      if (reactionId2 in state) {
        console.log('delete reactionid2', reactionId2)
        const newState = Object.assign({}, state)
        delete newState[reactionId2]
        return newState
      }

    default:
      return state
  }
}
