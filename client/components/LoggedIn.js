import React from 'react'
import { routeActions } from 'redux-simple-router'

const LoggedIn = (props) => {
  const {dispatch, currentUser, bins} = props
  return (
    <div className="logged-in">
      <span>Logged in as User {currentUser.id}. </span>
      <span>My bins: </span>
      {currentUser.myBins.map(slug => {
        const binDetails = bins[slug]
        return (
          <span key={binDetails.slug}>
            <a href="javascript:;"
              className="nav-bin-link" 
              onClick={()=>dispatch(routeActions.push('/'+binDetails.slug))}>
              {binDetails.slug}
            </a>{' '}
          </span>
        )
      })}
    </div>

  )
}

export default LoggedIn