import React, { Component, PropTypes } from 'react'
import {createBin} from '../actions/bins'

export default class CreateBin extends Component {

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e) {
    e.preventDefault()
    console.log('props', this.props)
    const {dispatch, params} = this.props
    dispatch(createBin(params.binId))
  }

  render() {
    
    return (
      <div>
        <h1>This bin doesn't exist.</h1>
        <a href='#' onClick={this.handleClick}>Create it</a>
      </div>
    )
  }
}
