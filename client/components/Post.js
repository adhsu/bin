import React, {Component} from 'react'
import Media from './Media'
import Reactions from './Reactions'
import Time from './Time'
import Source from './Source'
import {toggleReaction} from '../actions/posts'
import {deletePost} from '../actions/posts'
const closeImg = require('../static/images/close.svg')


class Post extends Component {

  constructor() {
    super();
    this.toggleReaction = this.toggleReaction.bind(this);
    this.delete = this.delete.bind(this)
  }

  delete(e) {
    console.log('boop')
    const {index, dispatch, post} = this.props
    const {binSlug, id} = post
    dispatch(deletePost(binSlug, id, index))
  }

  toggleReaction(emojiId) {
    const {dispatch, currentUser, post} = this.props
    const {id, binSlug} = post
    dispatch(toggleReaction(currentUser.id, id, emojiId, binSlug))
  }

  processUrl(url) {
    if (url.slice(0,7) !== 'http://') {
      return 'http://'+url
    } else {
      return url
    }
  }

  render() {
    const {index, dispatch, currentUser, post} = this.props
    const {binId, binSlug, createdAt, id, mediaType, reactions, title, url} = post

    return (
      <div className={
        'post post-style1 '
        + (currentUser.bins[binSlug]<createdAt ? 'post-new ': null)
      }>
        
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
            <span>bin/{binSlug}</span>
            

          </div>
        </div>
        
      </div>

    )
  }
} 

export default Post