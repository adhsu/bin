import React, { Component, PropTypes } from 'react'

const Source = (props) => {

  const extractDomain = (url) => {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }
    //find & remove port number
    domain = domain.split(':')[0];
    // remove subdomains
    // fuck js
    domain = domain.split('.').slice(-2).join('.')
    return domain;
  }

  return (
    <a className="post-source" href={props.url}>{extractDomain(props.url)}</a>
  )
}

export default Source