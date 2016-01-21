import React, { Component, PropTypes } from 'react'
const spinnerImg = require('../static/images/load-c.svg')

const Loading = (props) => {
    
  return (
    <div className={'loader-spinning ' + props.className} 
      style={{
        width: props.size || 50,
        height: props.size || 50
      }}>
      <img src={spinnerImg} />
    </div>
  )
}

export default Loading
