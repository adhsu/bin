import React, {Component} from 'react'
import Media from './Media'
import Reactions from './Reactions'
import Time from './Time'
import Source from './Source'
import {toggleReaction} from '../actions'

class Post extends Component {

  constructor() {
    super();
    this.toggleReaction = this.toggleReaction.bind(this);
  }

  toggleReaction(emojiId) {
    const {dispatch, post, currentUser} = this.props
    dispatch(toggleReaction(currentUser.id, post.id, emojiId))
  }

  render() {
    const {dispatch, post} = this.props
    const {id, url, title, mediaType, timestamp, reactions} = post

    return (
      <div className={'post post-'+id}>
        { title ? <a href={url} className="post-title" target="_blank">{title}</a> : null }
        { mediaType ? <Media mediaType={mediaType} url={url}/> : null }
        
        <div className="post-meta">

          <Reactions toggleReaction={this.toggleReaction} reactions={reactions} />

          <div className="post-meta-right">
            <Source url={url}/>
            {' '}&#183;{' '}
            <Time timestamp={timestamp}/>
          </div>
        </div>
        
      </div>

    )
  }
} 

export default Post