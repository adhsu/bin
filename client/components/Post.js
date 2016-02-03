import React, {Component} from 'react'
import Media from './Media'
import Reactions from './Reactions'
import Time from './Time'
import Source from './Source'

import {deletePost} from '../actions/posts'
const closeImg = require('../static/images/close.svg')


class Post extends Component {

  constructor() {
    super()
    this.delete = this.delete.bind(this)
  }

  delete(e) {
    const {dispatch, post} = this.props
    const {id, binId} = post
    dispatch(deletePost(id, binId))
  }

  processUrl(url) {
    if (url.slice(0,7) !== 'http://') {
      return 'http://'+url
    } else {
      return url
    }
  }

  renderDelete() {
    const {auth, post} = this.props
    if (auth.user.id !== post.authorId) { return; }
    return (
      <div className="post-close" onClick={e=>this.delete(e)}>
        <img src={closeImg} />
      </div>
    )
  }
  render() {
    const {dispatch, auth, post, reactions} = this.props
    const {id, binId, title, url, mediaType, createdAt} = post

    return (
      <div className='post post-style1'>
        {this.renderDelete()}
        
        { title ? <div className="post-title-wrapper"><a href={this.processUrl(url)} className="post-title" target="_blank">{title}</a></div> : null }
        { mediaType ? <Media mediaType={mediaType} url={url}/> : null }
        
        <div className="post-meta">

          <Reactions {...this.props} />

          <div className="post-meta-right">

            <Source url={url}/>
            {' '}&#183;{' '}
            <Time timestamp={createdAt}/>
            
          </div>
        </div>
        
      </div>

    )
  }
} 

export default Post