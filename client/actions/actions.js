import * as types from './actionTypes';

export function toggleReaction(userId, postId, emojiId) {
  return {
    type: types.TOGGLE_REACTION,
    userId,
    postId,
    emojiId
  }
}

export function displayError(message) {
  return {
    type: types.DISPLAY_ERROR,
    message
  }
}
