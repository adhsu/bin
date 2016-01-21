import * as types from './actionTypes';
import {_throttle} from '../helpers/utils'

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

    window.addEventListener('resize', _throttle(
      () => dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth))
      , 1000)
    )
  };
}