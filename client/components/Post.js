import React, {Component} from 'react'
import Media from './Media'
import Reactions from './Reactions'
import Time from './Time'
import Source from './Source'
import {toggleReaction} from '../actions/actions'
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
    const {index, dispatch, binSlug, id} = this.props
    dispatch(deletePost(binSlug, id, index))
  }

  toggleReaction(emojiId) {
    const {dispatch, currentUser, id} = this.props
    dispatch(toggleReaction(currentUser.id, id, emojiId))
  }

  processUrl(url) {
    if (url.slice(0,7) !== 'http://') {
      return 'http://'+url
    } else {
      return url
    }
  }

  render() {
    const {index, dispatch, currentUser, bins, post} = this.props

    const {author, binId, binSlug, createdAt, id, mediaType, reactions, title, url} = post
    
    const isAuthor = currentUser.id == author

    return (
      <div className={
        'post post-style1 '
        + (bins[binSlug].lastViewed<createdAt ? 'post-new ': null)
        + (isAuthor ? 'post-author ' : null)} >
        

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