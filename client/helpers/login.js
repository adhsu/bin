import {TWITTER_LOGIN_URL} from '../constants/Config'
import {loginUser, logoutUser} from '../actions/auth'
import {parseQueryString} from './utils'

export function popupTwitterLogin (dispatch) {
  const options = `toolbar=no,scrollbars=yes,height=400,width=600,top=${screen.height/2-300},left=${screen.width/2-300}`    
  const authPopup = window.open(TWITTER_LOGIN_URL, '_blank', options)
  window.authCallback = (data) => {
    authPopup.close()
    const qs = authPopup.location.search
    const qsObj = parseQueryString(qs)
    const token = qsObj.access_token
    dispatch(loginUser(token))
  }
}
