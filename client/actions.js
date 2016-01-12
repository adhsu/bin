// action types
export const SUBMIT_NEW_POST = 'SUBMIT_NEW_POST'
export const TOGGLE_REACTION = 'TOGGLE_REACTION'
export const SIGNUP = 'SIGNUP'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const OPEN_MODAL = 'OPEN_MODAL'
export const CLOSE_MODAL = 'CLOSE_MODAL'
export const DISPLAY_ERROR = 'DISPLAY_ERROR'

// action creators

export function submitNewPost(data) {
  return {
    type: SUBMIT_NEW_POST,
    data
  }
}

export function toggleReaction(userId, postId, emojiId) {
  console.log('toggling rxn')
  return {
    type: TOGGLE_REACTION,
    userId,
    postId,
    emojiId
  }
}

export function displayError(message) {
  return {
    type: DISPLAY_ERROR,
    message
  }
}
