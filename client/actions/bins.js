import 'whatwg-fetch'
import * as types from '../constants/ActionTypes';
import {API_BASE_URL, API_DELAY} from '../constants/Config'
import {delay} from '../helpers/utils'
import {fetchPosts} from './posts'

function receiveBin(bin) {
  return {
    type: types.RECEIVE_BIN,
    bin
  }
}

export function joinBin(binId, invite_code) {
  return (dispatch, getState) => {
    const {auth} = getState()
    const url = `${API_BASE_URL}/bins/${binId}/join?auth_token=${auth.token}`
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({invite_code})
    }
    return fetch(url, options)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        console.log('joined bin, json ', json)
        dispatch(receiveBin(json))
        dispatch(fetchPosts(auth.token, binId))
      })
      .catch(err => { throw err })
  }
}
