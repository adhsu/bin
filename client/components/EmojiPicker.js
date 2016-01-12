import React, { Component, PropTypes } from 'react'
import emojis from '../helpers/emojis-short'
const addReactionImg = require('../static/images/add-reaction.png')

export default class EmojiPicker extends Component {
  constructor() {
    super();
    this.state = {
      pickerIsOpen: false
    }
    this.togglePicker = this.togglePicker.bind(this)
  }

  handleClick(emojiId, event) {
    const {toggleReaction} = this.props
    this.setState({pickerIsOpen:false})
    toggleReaction(emojiId)
  }
  
  togglePicker() {
    this.setState({pickerIsOpen:!this.state.pickerIsOpen})
  }

  render() {
    
    return (
      <div className="emoji-picker-wrapper">
        
        <div 
          className={ this.state.pickerIsOpen ? 'emoji-picker-button active' : 'emoji-picker-button'}
          onClick={this.togglePicker}>
          <img src={addReactionImg} />
        </div>

        

        {this.state.pickerIsOpen ? (
          <div className="emoji-list-wrapper">
            {Object.keys(emojis).map(id => {
              let boundHandleClick = this.handleClick.bind(this, id)
              return (
                <div key={id} className="emoji-list-item" onClick={boundHandleClick}>
                  {emojis[id]}
                </div>
              )
            })}
          </div>
        ) : null}

      </div>
        
        
    )
  }
}

