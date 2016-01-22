import * as types from './actionTypes';

export function displayError(message) {
  return {
    type: types.DISPLAY_ERROR,
    message
  }
}
