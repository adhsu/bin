import React, {Component, PropTypes } from 'react'
import {connect} from 'react-redux';


class Nav extends Component {
  render() {
    const {dispatch, currentUser} = this.props
    return (
      <div className="nav">
        <div className="nav-logo">bin</div>
        <span>User {currentUser.id}</span>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {currentUser} = state
  return {currentUser}
}

export default connect(mapStateToProps)(Nav)
