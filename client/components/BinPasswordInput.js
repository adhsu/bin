import React, { Component, PropTypes } from 'react'
import {joinBin} from '../actions/bins'

export default class BinPasswordInput extends Component {
  
  componentDidMount() {
    const {routing} = this.props
    const pwFromQuery = routing.location.query.password
    if (pwFromQuery) {
      // this.refs.binPwInput.value = pwFromQuery
    }
    this.refs.binPwInput.focus()
    this.joinBin = this.joinBin.bind(this)
  }

  joinBin(e) {
    e.preventDefault()
    const {dispatch, auth, params} = this.props
    const password = this.refs.binPwInput.value
    dispatch(joinBin(params.binId, password))
  }

  render() {
    
    return (
      <div>
        <form className="bin-password-form" ref="binPwForm" onSubmit={this.joinBin}>
          <input 
            type="text"
            className="bin-password-input"
            placeholder="Enter the password"
            ref='binPwInput' />
        </form>
      </div>
    )
  }
}
