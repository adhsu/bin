import React, {Component} from 'react'
import Reaction from './Reaction'
import emojis from '../helpers/emojis'
import EmojiPicker from './EmojiPicker'

export default class Reactions extends Component {
  render() {

    const {toggleReaction, reactions} = this.props

    return (
      <div className="reactions">
        

        {Object.keys(reactions).map((key) => {
          return <Reaction 
            key={key}
            toggleReaction={toggleReaction}
            emojiId={key}
            reactionObj={reactions[key]} />
        })}

        { Object.keys(reactions).length < 4 ? <EmojiPicker toggleReaction={toggleReaction} /> : null}
        
      </div>

    )
  }
}
