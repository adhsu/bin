import 'whatwg-fetch'
import Cookies from 'js-cookie'
import * as types from './actionTypes'
import {API_BASE_URL} from './../config'
import {_throttle} from '../helpers/utils'

export function initAuth() {
    return dispatch => {
        const accessToken = Cookies.get(COOKIE_PATH);
        if (accessToken) {
            return dispatch(authUser(accessToken));
        }
        return null;
    }
}

function authUser(accessToken) {
    return dispatch => {
        dispatch(fetchAuthedUser(accessToken));
    };
}

function fetchAuthedUser(accessToken) {
    return dispatch => {
        return fetch(`${API_BASE_URL}/me?oauth_token=${accessToken}`)
            .then(response => response.json())
            .then(json => dispatch(receiveAuthedUserPre(accessToken, json)))
            .catch(err => { throw err; });
    };
}