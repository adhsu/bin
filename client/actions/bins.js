import 'whatwg-fetch'
import * as types from '../constants/ActionTypes';
import {API_BASE_URL, API_DELAY} from '../constants/Config'
import {delay, findById} from '../helpers/utils'
import {fetchAuthedUser} from './auth'

function receiveBins(bins) {
  return {
    type: types.RECEIVE_BINS,
    bins
  }
}

function receiveBin(binId, bin) {
  return {
    type: types.RECEIVE_BIN,
    binId, bin
  }
}

export function fetchBins(token) {
  return dispatch => {
    if (token=='butts') {
      const fakeBins = [
        {
          id: 'fell',
          title: "Fell Street Dope-Ass Bin",
          users: ['0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216'],
          createdAt: 1454012406446
        },
        {
          id: 'southpark',
          title: "112 South Park Bin. No weird stuff.",
          users: ['0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216'],
          createdAt: 1454012406446
        }
      ]
      dispatch(receiveBins(fakeBins))
    }

    // return fetch(`${API_BASE_URL}/bins?token=${token}`)
    //   .then(delay(API_DELAY))
    //   .then(response => response.json())
    //   .then(json => {
    //     return dispatch(receiveBins(json))
    //   })
    //   .catch(err => { throw err })

  }
}

export function fetchBin(binId) {
  return (dispatch, getState) => {
    const {auth} = getState()
    const fakeLimitedBin = {
      id: 'newbin',
      title: 'Heroes of New Bins'
    }
    dispatch(receiveBin(binId, fakeLimitedBin))

    // return fetch(`${API_BASE_URL}/bins/${binId}?token=${token}`)
    //   .then(delay(API_DELAY))
    //   .then(response => response.json())
    //   .then(json => {
    //     return dispatch(receiveBin(binId, json))
    //   })
    //   .catch(err => { throw err })
  }
}

export function joinBin(binId, password) {
  return (dispatch, getState) => {
    const {auth} = getState()
    const url = `${API_BASE_URL}/bins/${binId}/join?token=${auth.token}&password=${password}`
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }
    return fetch(url, options)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        // now that I'm in, fetch authed user again to refresh
        dispatch(fetchAuthedUser(auth.token))
      })
      .catch(err => { throw err })
  }
}
