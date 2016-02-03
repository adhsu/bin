import 'whatwg-fetch'
import Cookies from 'js-cookie'
import {routeActions} from 'react-router-redux'
import {fetchPosts} from './posts'
import {fetchReactions} from './reactions'
import * as types from '../constants/ActionTypes';
import {API_BASE_URL, API_DELAY} from '../constants/Config'
import {delay, findById} from '../helpers/utils'

const COOKIE_PATH = 'binAccessToken'

export function initAuth() {
  return dispatch => {
    let token = Cookies.get(COOKIE_PATH)
    console.log('initAuth with token', token)
    if (token) {
      dispatch(fetchAuthedUser(token))
    } else {
      dispatch(receiveAuth(null, null))
      return null
    }
  }
}

export function loginUser(token) {
  console.log('login with token',token)
  return dispatch => {
    Cookies.set(COOKIE_PATH, token)
    dispatch(fetchAuthedUser(token))
  }
}

export function logoutUser() {
  console.log('log out')
  return dispatch => {
    Cookies.remove(COOKIE_PATH)
    dispatch(routeActions.push('/'))
    dispatch(resetAuthed())
  }
}

export function fetchAuthedUser(token) {
  return dispatch => {
    dispatch(requestAuth())
    return fetch(`${API_BASE_URL}/me?auth_token=${token}`)
      .then(delay(API_DELAY))
      .then(response => response.json())
      .then(json => {
        return dispatch(receiveAuthedUserPre(token, json))
      })
      .catch(err => { throw err; })
  }
}

function receiveAuthedUserPre(token, user) {
  return (dispatch, getState) => {    
    const {routing} = getState()
    const curBinId = routing.location.pathname.slice(1) || null
    dispatch(receiveAuth(token, user))
    dispatch(fetchReactions(token))

    const inBin = findById(user.bins, curBinId)
    if (curBinId && inBin) { 
      console.log('initial auth - fetch posts')
      dispatch(fetchPosts(token, curBinId))
    }
    if (!curBinId && user.lastViewedBin && user.lastViewedBin !== '') {
      dispatch(routeActions.push('/'+user.lastViewedBin))
    }
  }
}

export function updateUser(update) {
  return (dispatch, getState) => {
    const {auth} = getState()
    const url = `${API_BASE_URL}/me?token=${auth.token}`
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update)
    }

    // return fetch(url, options)
    //   .then(delay(API_DELAY))
    //   .then(response => response.json())
    //   .then(json => {
    //     return dispatch(receiveAuthedUser(json))
    //   })
    //   .catch(err => { throw err; })
  }
}

function requestAuth() {
  return {
    type: types.REQUEST_AUTH
  }
}

function receiveAuth(token, user) {
  return {
    type: types.RECEIVE_AUTH,
    token, user
  }
}

function resetAuthed() {
  return {
    type: types.RESET_AUTHED
  }
}
