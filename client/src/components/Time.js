import React, { Component, PropTypes } from 'react'
import moment from 'moment'

moment.locale('en', {
  relativeTime : {
    future : "in %s",
    past : "%s", // or "%s ago"
    s : "now",
    m : "1m",
    mm : "%dm",
    h : "1h",
    hh : "%dh",
    d : "1d",
    dd : "%dd",
    M : "1m",
    MM : "%dm",
    y : "1y",
    yy : "%dy"
  }
})

const Time = (props) => {
  return (
    <span>{moment(props.timestamp).fromNow()}</span>
  )
}

export default Time
