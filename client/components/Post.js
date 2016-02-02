import React, {Component} from 'react'
import Media from './Media'
import Reactions from './Reactions'
import Time from './Time'
import Source from './Source'

import {toggleReaction} from '../actions/reactions'
import {deletePost} from '../actions/posts'
const closeImg = require('../static/images/close.svg')


class Post extends Component {

  constructor() {
    super()
    this.toggleReaction = this.toggleReaction.bind(this)
    this.delete = this.delete.bind(this)
  }

  delete(e) {
    const {dispatch, post} = this.props
    const {binId, id} = post
    dispatch(deletePost(binId, id))
  }

  toggleReaction(emojiId) {
    const {dispatch, post} = this.props
    const {binId, id} = post
    // dispatch(toggleReaction(currentUser.id, id, emojiId, binSlug))
  }

  processUrl(url) {
    if (url.slice(0,7) !== 'http://') {
      return 'http://'+url
    } else {
      return url
    }
  }

  render() {
    const {dispatch, auth, post} = this.props
    const {id, binId, title, url, mediaType, createdAt, reactions} = post

    return (
      <div className='post post-style1'>
        
        <div className="post-close" onClick={e=>this.delete(e)}>
          <img src={closeImg} />
        </div>
        
        { title ? <div className="post-title-wrapper"><a href={this.processUrl(url)} className="post-title" target="_blank">{title}</a></div> : null }
        { mediaType ? <Media mediaType={mediaType} url={url}/> : null }
        
        <div className="post-meta">

          <Reactions toggleReaction={this.toggleReaction} reactions={reactions} />

          <div className="post-meta-right">

            <Source url={url}/>
            {' '}&#183;{' '}
            <Time timestamp={createdAt}/>
            {' '}&#183;{' '}
            <span>bin/{binId}</span>
            

          </div>
        </div>
        
      </div>

    )
  }
} 

export default Post