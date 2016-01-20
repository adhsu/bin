import React from 'react'

const NavLogoMenu = (props) => {

  const {currentUser, bins, users} = props
  console.log(currentUser.currentBin, bins, users)
  return (
    <div className="nav-logo-menu">
      <ul className="nav-logo-menu-ul">
        {bins[currentUser.currentBin]['users'].map(id => {
          return (
            <li key={id}>
              {users[id]['username']}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default NavLogoMenu