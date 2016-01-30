import 'whatwg-fetch'
import Cookies from 'js-cookie'
import {routeActions} from 'react-router-redux'
import {fetchPosts} from './posts'
import {fetchReactions} from './reactions'
import * as types from '../constants/ActionTypes';
import {API_BASE_URL, API_DELAY} from '../constants/Config'
import {delay} from '../helpers/utils'

const COOKIE_PATH = 'binAccessToken'

export function initAuth() {
  return dispatch => {
    let token = Cookies.get(COOKIE_PATH)
    // token = 'butts'
    if (token) {
      dispatch(fetchAuthedUser(token))
    }
    return null
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
  console.log('fetching authed user with token ', token)
  return dispatch => {
    // if (token=='butts') {
    //   const fakeUser = {
    //     id: "0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216",
    //     username: '@adhsu',
    //     lastViewedBin: 'fell',
    //     bins: [
    //       {
    //         id: 'fell',
    //         title: "Fell Street Dope-Ass Bin",
    //         users: ['@adhsu', '@connorzwick', '@MITDelian'],
    //         createdAt: 1454012406446
    //       },
    //       {
    //         id: 'southpark',
    //         title: "112 South Park Bin. No weird stuff.",
    //         users: ['@adhsu'],
    //         createdAt: 1454012406446
    //       }
    //     ],
    //     binsOld: [
    //       { id: 'fell', lastViewed: 1453430821034 },
    //       { id: 'southpark', lastViewed: 1453430821034 }
    //     ]
    //   }

    //   dispatch(receiveAuthedUserPre(token, fakeUser))
    // }

    return fetch(`${API_BASE_URL}/me?token=${token}`)
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
    dispatch(receiveToken(token))
    dispatch(receiveAuthedUser(user))
    dispatch(fetchReactions(token))    
    if (curBinId) { 
      dispatch(fetchPosts(token, curBinId))
    }
    if (!curBinId && user.lastViewedBin !== '') {
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

function receiveToken(token) {
  return {
    type: types.RECEIVE_TOKEN,
    token
  }
}

function receiveAuthedUser(user) {
  return {
    type: types.RECEIVE_AUTHED_USER,
    user
  }
}

function resetAuthed() {
  return {
    type: types.RESET_AUTHED
  }
}
