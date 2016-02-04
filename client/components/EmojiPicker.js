import React, { Component, PropTypes } from 'react'
import Popover from './Popover'
import emojis from '../helpers/emojis-short'
const addReactionImg = require('../static/images/add-reaction.png')

export default class EmojiPicker extends Component {
  
  handleClick(emojiId, event) {
    const {addReaction} = this.props
    addReaction(emojiId)
    this.refs.popover.handleOutsideClick()
  }

  render() {
    
    return (
      <Popover className='emoji-picker-wrapper' ref="popover">
        <div className='emoji-picker-button'>
          <img src={addReactionImg} />
        </div>

        <div className="emoji-picker-popover popover-content">
          {Object.keys(emojis).map(id => {
            let boundHandleClick = this.handleClick.bind(this, id)
            return (
              <div key={id} className="emoji-list-item" onClick={boundHandleClick}>
                {emojis[id]}
              </div>
            )
          })}
        </div>

      </Popover>

      
        
        
    )
  }
}

