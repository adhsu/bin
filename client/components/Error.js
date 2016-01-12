import React, { Component, PropTypes } from 'react'

class Error extends Component {

  handleClick(e) {
    this.props.onClickFn()
  }

  render() {
    const {message} = this.props

    return (
      <div className="error-wrapper" onClick={e=>this.handleClick(e)}>
        <div className="error-content">
          {message}
        </div>
      </div>
    )
  }
}

export default Error
