import update from 'react-addons-update'
import {combineReducers} from 'redux'
import {SUBMIT_NEW_POST, TOGGLE_REACTION, DISPLAY_ERROR} from './actions'
import initialState from './initialState'


function posts(state=initialState.posts, action) {
  switch(action.type) {
    case SUBMIT_NEW_POST:
      
      return Object.assign({}, state, {[Date.now()]: action.data})
    
    case TOGGLE_REACTION:
      const reactions = state[action.postId]['reactions']
      const reaction = reactions[action.emojiId]
      
      // add key if you're the first one
      if (reaction==null) {
        return update(state, {
          [action.postId]: {
            reactions: {$merge: {
                [action.emojiId]: {
                  userVoted: true,
                  num: 1
                }
              }
            }
          }
        })
      }

      // delete emojiId key if you're the last one and removed your reaction
      if (reaction.userVoted && reaction.num==1) {
        const newState = Object.assign({}, state)
        delete newState[action.postId]['reactions'][action.emojiId]
        return newState
      }

      // toggle if others have already reacted
      if (reaction!==null) {
        const newReaction = {
          userVoted: !reaction.userVoted,
          num: reaction.userVoted ? reaction.num-1 : reaction.num+1
        }

        return update(state, {
          [action.postId]: {
            reactions: {
              [action.emojiId]: {$merge: newReaction}
            }
          }
        })
      }

    default:
      return state
  }
}

function currentUser(state = initialState.currentUser, action) {
  return state
}

function view(state = initialState.view, action) {
  switch(action.type) {
    case DISPLAY_ERROR:
      return Object.assign({}, state, {error: action.message})
    default:
      return state
  }
}

const rootReducer = combineReducers({
  posts,
  currentUser,
  view
})

export default rootReducer 

