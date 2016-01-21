import React, { Component, PropTypes } from 'react'
import moment from 'moment'

const Time = (props) => {
  return (
    <span>{moment(props.timestamp).fromNow()}</span>
  )
}

export default Time
