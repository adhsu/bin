import React, {Component, PropTypes } from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import LoggedIn from './LoggedIn'
import NavLogoMenu from './NavLogoMenu'

class Nav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuIsOpen: false
    }
  }

  handleClick() {
    this.setState({menuIsOpen: !this.state.menuIsOpen})
  }

  render() {
    const {dispatch, currentUser, bins, slug} = this.props
    return (
      <div className="nav">
        <div className="nav-left">
          <div className="nav-logo-wrapper" onClick={e=>this.handleClick(e)}>
            <span className="nav-logo">
              <Link to="/">bin</Link>
              {'/'}
              {slug ? <Link to={'/'+slug}>{slug}</Link> : null}
            </span>
            { (this.state.menuIsOpen && bins[currentUser.currentBin]) ? <NavLogoMenu {...this.props}/> : null }
          </div>
        </div>
        
        
        <div className="nav-right">
          { currentUser ? <LoggedIn {...this.props} /> : null}
          

        </div>
        
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {currentUser, bins, users, routing} = state
  return {currentUser, bins, users, routing}
}

export default connect(mapStateToProps)(Nav)
