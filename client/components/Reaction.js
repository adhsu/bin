import React, { Component, PropTypes } from 'react'
import emojis from '../helpers/emojis'
import {toggleReaction} from '../actions/actions'

class Reaction extends Component {

  handleClick(e) {
    const {emojiId, toggleReaction} = this.props
    toggleReaction(emojiId)
  }

  render() {
    const {emojiId, reactionObj} = this.props

    return (
      <div 
        className={reactionObj.userVoted ? 'reaction reacted' : 'reaction'}
        onClick={e=>this.handleClick(e)} >
        
        <span className="reaction-emoji">{emojis[emojiId]}</span>
        <span className="reaction-num">{reactionObj.num}</span>

      </div>
    )
  }
}

export default Reaction
