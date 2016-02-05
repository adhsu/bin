import React, {Component} from 'react'
import {connect} from 'react-redux'

class Login extends Component {

  componentWillMount() {
    const {routing} = this.props
    const token = routing.location.query.access_token
    setTimeout(window.opener.authCallback, 1)

  }

  render() {
    return;
  }
} 

function mapStateToProps(state) {
  const {routing} = state
  return {routing}
}

export default connect(mapStateToProps)(Login);
