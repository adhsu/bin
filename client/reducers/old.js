import update from 'react-addons-update'
import { UPDATE_LOCATION } from 'redux-simple-router'
import * as types from './constants/ActionTypes';
import {createLookupObj} from './helpers/utils'

function posts(state={}, action) {
  switch(action.type) {

    case types.RECEIVE_POSTS:
      if (!state[action.params.slug]) {
        // if no posts from bin
        // console.log('no posts in bin, posts are ', action.posts, state)
        return Object.assign({}, state, {
          [action.params.slug]: action.posts
        })
      } else {
        // if already exists, push to end of array
        // console.log('posts in bin already exist, pushing...')
        return update(state, {
          [action.params.slug]: {$push: action.posts}
        })
      }

    case types.RECEIVE_NEW_POST:
      
      return update(state, {
        [action.data.binSlug]: {$unshift: [action.data]}
      })

    case types.REQUEST_DELETE_POST:
      return update(state, {
        [action.binSlug]: {$splice: [[action.index, 1]]}
      })
    
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

function currentUser(state={}, action) {
  switch(action.type) {
    case types.UPDATE_LOCATION:
      return state

    default:
      return state
  }
}

function view(state={}, action) {
  switch(action.type) {
    case types.DISPLAY_ERROR:
      return Object.assign({}, state, {error: action.message})
    case types.REQUEST_POSTS:
      return Object.assign({}, state, {isLoading: true})
    case types.RECEIVE_POSTS:
      return Object.assign({}, state, {isLoading: false})

    case types.CHANGE_IS_MOBILE:
      return Object.assign({}, state, {
        isMobile: action.isMobile
      });
    case types.CHANGE_WIDTH_AND_HEIGHT:
      return Object.assign({}, state, {
        height: action.height,
        width: action.width
      });
    default:
      return state
  }
}

function bins(state={}, action) {
  switch(action.type) {
    case types.RECEIVE_BINS:
      return Object.assign({}, action.bins)
    default:
      return state
  }
}

export default {
  posts,
  currentUser,
  view,
  bins
}

