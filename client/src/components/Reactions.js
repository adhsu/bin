import React, {Component} from 'react'
import Reaction from './Reaction'
import emojis from '../helpers/emojis'
import EmojiPicker from './EmojiPicker'
import {addReaction, deleteReaction} from '../actions/reactions'

export default class Reactions extends Component {
  
  constructor() {
    super()
    this.addReaction = this.addReaction.bind(this)
    this.deleteReaction = this.deleteReaction.bind(this)
  }

  addReaction(emojiId) {
    const {dispatch, post} = this.props   
    dispatch(addReaction(post.binId, post.id, emojiId))
  }

  deleteReaction(emojiId) {
    const {dispatch, post} = this.props
    dispatch(deleteReaction(post.binId, post.id, emojiId))
  }

  render() {

    const {dispatch, auth, post, reactions} = this.props
    return (
      <div className="reactions">
        
        {Object.keys(post.reactions).map((key) => {

          const reactionId = `${auth.user.id}_${post.id}_${key}`
          return <Reaction 
            key={key}
            emojiId={key}
            reacted={reactionId in reactions}
            reactions={reactions}
            count={post.reactions[key]}
            addReaction={this.addReaction}
            deleteReaction={this.deleteReaction} />
        })}

        { Object.keys(post.reactions).length < 4 ? <EmojiPicker addReaction={this.addReaction} /> : null}
        
      </div>

    )
  }
}
