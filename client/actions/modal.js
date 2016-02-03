import 'whatwg-fetch'
import * as types from '../constants/ActionTypes';
import {API_BASE_URL, API_DELAY} from '../constants/Config'

export function changeModal (modal) {
  return {
    type: types.CHANGE_MODAL,
    modal
  }
}

function requestTitle() {
  return {
    type: types.REQUEST_TITLE
  }
}

function receiveTitle(title) {
  return {
    type: types.RECEIVE_TITLE,
    title
  }
}

export function resetModal() {
  return {
    type: types.RESET_MODAL
  }
}

export function fetchTitle (url) {
  return dispatch => {
    const apiUrl = `${API_BASE_URL}/title`
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({url})
    }

    dispatch(requestTitle())
    return fetch(apiUrl, options)
      .then(response => response.json())
      .then(json => {
        console.log('fetchTitle json ', json)
        if (json.ok) {
          dispatch(receiveTitle(json.data.ogTitle || json.data.title))
        } else {
          dispatch(receiveTitle(""))
        }
        // this.refs.title.focus()
      })
      .catch(error => {
        dispatch(receiveTitle(""))
        // this.refs.title.focus()
        console.log('error with fetch title: ', error.message)
      })
  }
}
