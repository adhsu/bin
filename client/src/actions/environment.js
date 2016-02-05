import {_debounce, _throttle} from '../helpers/utils'
import * as types from '../constants/ActionTypes';

export function displayError(message) {
  return {
    type: types.DISPLAY_ERROR,
    message
  }
}

function changeIsMobile(isMobile) {
  return {
    type: types.CHANGE_IS_MOBILE,
    isMobile
  };
}

function changeWidthAndHeight(height, width) {
  return {
    type: types.CHANGE_WIDTH_AND_HEIGHT,
    height,
    width
  };
}

export function initEnvironment() {
  return dispatch => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // if (isMobile) {
    //   document.body.style.overflow = 'hidden';
    // }

    dispatch(changeIsMobile(isMobile));
    dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth));

    window.addEventListener('resize', _debounce(
      () => dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth))
      , 500)
    )
  };
}