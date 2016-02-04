import React, {Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import {routeActions} from 'react-router-redux'
import Popover from '../components/Popover'
import {loginUser, logoutUser} from '../actions/auth'
import NavLogoMenu from '../components/NavLogoMenu'
import {_throttle, findById} from '../helpers/utils'
import {popupTwitterLogin} from '../helpers/login'
const lockImg = require('../static/images/locked.svg')

class Nav extends Component {
  constructor(props) {
    super(props)
    this.state = {
      menuIsOpen: false
    }
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    console.log('nav receives props ', this.props, nextProps)
  }

  login(e) {
    e.preventDefault();
    const {dispatch} = this.props;    
    popupTwitterLogin(dispatch)
  }

  logout(e) {
    e.preventDefault();
    const {dispatch} = this.props;
    dispatch(logoutUser())
  }

  handleClick() {
    this.setState({menuIsOpen: !this.state.menuIsOpen})
  }

  renderBinsList(myBins) {
    const {dispatch, auth} = this.props

    if (myBins.length == 0) { 
      return (
        <div>No bins.</div>
      )
    }

    return (
      <div>
        My bins: 
        {' [ '}
        {myBins.map(bin => {
          return (
            <span key={bin.id}>
              <a href="javascript:;"
                className="nav-bin-link" 
                onClick={()=>dispatch(routeActions.push('/'+bin.id))}>
                {bin.id}
              </a>
              {' '}/{' '}
            </span>
          )
        })}
        {' ] '}
      </div>
    )
  }

  renderNavUser() {
    const {dispatch, auth} = this.props
    if (auth.user) {
      const myBins = auth.user.bins || []
      return (
        <div className="nav-right-inner">
          <ul className="nav-right-ul">
            <li>
              {this.renderBinsList(myBins)}
            </li>
            <li>
              <span className="nav-user-id">@{auth.user.id}</span>
              <img className="nav-user-avatar" src={auth.user.avatarUrl}/>
            </li>
            <li>
              <a href='#' onClick={this.logout}>Log Out</a>
            </li>
          </ul>
        </div>
      )
    }

    return (
      <div className="nav-right-inner">
        <a href='#' onClick={this.login}>Sign in with Twitter</a>
      </div>
    )
    
  }

  renderBinName() {
    const {dispatch, auth, bin, params} = this.props
    const {binId} = params
    
    if (!binId) {
      return;
    }

    if (!auth.user) {
      return <span>/{binId}</span>
    }
    const thisBin = findById(auth.user.bins, binId)
    if (auth.user.bins.length==0 || !thisBin) {
      return <span>/{binId}</span>
    }
    const users = thisBin.users
    const inviteLink = `${window.location.host}/${binId}?invite_code=${thisBin.invite_code}`
    return (
      <span>
        <Popover className='nav-users'>
          <div className="nav-users-link">
            /{binId}
          </div>
          <div className="nav-users-popover popover-content">
            <ul className="nav-users-list">
              {
                users.map(user => {
                  return (
                    <li key={user.id} className="nav-users-item">
                      @{user.id}
                    </li>
                  )
                })
              }
            </ul>
          </div>

        </Popover>
        
        <Popover className='bin-invite' initiallyOpen={bin.firstTimeInBin}> 
          <span className="bin-invite-link">
            <img src={lockImg} />
          </span>
          <div className="bin-invite-popover popover-content">
            <p>Invite a friend with this link:</p>
            <p className="bin-invite-url">{inviteLink}</p>
          </div>
        </Popover>



      </span>
    )
  }

  render() {
    const {dispatch, auth, params} = this.props
    return (
      <div className="nav">
        <div className="nav-left">
          <div className="nav-logo-wrapper" onClick={e=>this.handleClick(e)}>
            <span className="nav-logo">
              <Link to={'/'}>Bin</Link>              
              {this.renderBinName()}
              
            </span>
            
          </div>
        </div>
        <div className="nav-right">
          {this.renderNavUser()}
        </div>
        
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {auth, bin, environment} = state
  return {auth, bin, environment}
}

export default connect(mapStateToProps)(Nav)
