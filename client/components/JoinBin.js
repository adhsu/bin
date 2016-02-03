import React, { Component, PropTypes } from 'react'
import {joinBin} from '../actions/bins'

export default class JoinBin extends Component {
  
  constructor() {
    super()
    this.joinBin = this.joinBin.bind(this)
  }

  componentDidMount() {
    const {routing} = this.props
    const pwFromQuery = routing.location.query.invite_code
    if (pwFromQuery) {
      this.refs.binPwInput.value = pwFromQuery
    }
    this.refs.binPwInput.focus()
  }

  joinBin(e) {
    e.preventDefault()
    const {dispatch, auth, params} = this.props
    const invite_code = this.refs.binPwInput.value
    dispatch(joinBin(params.binId, invite_code))
  }

  render() {
    const {bin} = this.props

    return (
      <div>
        <form className="bin-password-form" ref="binPwForm" onSubmit={this.joinBin}>
          <input 
            type="text"
            className="bin-password-input"
            placeholder="Enter the password"
            ref='binPwInput' />
          <p className="join-bin-error u-textCenter">{bin.error}</p>
        </form>
      </div>
    )
  }
}
