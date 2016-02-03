import update from 'react-addons-update'
import { UPDATE_LOCATION } from 'redux-simple-router'
import * as types from './constants/ActionTypes';
import {createLookupObj} from './helpers/utils'

function posts(state={}, action) {
  switch(action.type) {

    case types.REQUEST_TOGGLE_REACTION:
      return state
      // const reactions = state[action.postId]['reactions']
      // const reaction = reactions[action.emojiId]
      
      // // add key if you're the first one
      // if (reaction==null) {
      //   return update(state, {
      //     [action.postId]: {
      //       reactions: {$merge: {
      //           [action.emojiId]: {
      //             userVoted: true,
      //             num: 1
      //           }
      //         }
      //       }
      //     }
      //   })
      // }

      // // delete emojiId key if you're the last one and removed your reaction
      // if (reaction.userVoted && reaction.num==1) {
      //   const newState = Object.assign({}, state)
      //   delete newState[action.postId]['reactions'][action.emojiId]
      //   return newState
      // }

      // // toggle if others have already reacted
      // if (reaction!==null) {
      //   const newReaction = {
      //     userVoted: !reaction.userVoted,
      //     num: reaction.userVoted ? reaction.num-1 : reaction.num+1
      //   }

      //   return update(state, {
      //     [action.postId]: {
      //       reactions: {
      //         [action.emojiId]: {$merge: newReaction}
      //       }
      //     }
      //   })
      // }
    case types.RECEIVE_TOGGLE_REACTION:
      
      return update(state, {
        [action.binSlug]: {$apply: (posts) => {
          return posts.map(post => {
            if (post.id !== action.data.id) {
              return post
            } else {
              return action.data
            }

          })
        }}
      })
      return state


    default:
      return state
  }
}

