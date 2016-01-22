import React from 'react'
import { routeActions } from 'redux-simple-router'

const LoggedIn = (props) => {
  const {dispatch, currentUser, bins} = props
  return (
    <div className="logged-in">
      <span>Logged in as {currentUser.username}. </span>
      <span>Bins: </span>
      {Object.keys(currentUser.bins).map(slug => {
        return (
          <span key={slug}>
            <a href="javascript:;"
              className="nav-bin-link" 
              onClick={()=>dispatch(routeActions.push('/'+slug))}>
              {slug}
            </a>{' '}
          </span>
        )
      })}
    </div>

  )
}

export default LoggedIn