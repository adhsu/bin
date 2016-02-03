import React, { Component, PropTypes } from 'react'
import emojis from '../helpers/emojis'

class Reaction extends Component {

  constructor() {
    super()
    this.setReaction = this.setReaction.bind(this)
  }

  setReaction(e) {
    const {reacted, emojiId, addReaction, deleteReaction} = this.props
    console.log('setreaction', reacted, emojiId)
    reacted ? deleteReaction(emojiId) : addReaction(emojiId)
  }

  render() {
    const {emojiId, count, reacted} = this.props
    
    return (
      <div 
        className={'reaction ' + (reacted ? 'reacted' : null)}
        onClick={e=>this.setReaction(e)} >
        
        <span className="reaction-emoji">{emojis[emojiId]}</span>
        <span className="reaction-num">{count}</span>

      </div>
    )
  }
}

export default Reaction
