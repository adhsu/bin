import React, {Component} from 'react'
import {addProtocol, getImgurId, fixYoutubeUrl} from '../helpers/utils'


class Media extends Component {
  
  renderVideo(url) {
    
    return (
      <div className="media-frame">
        <video className="media-video" preload="auto" autoPlay="autoplay" muted="muted" loop="loop" webkit-playsinline="">
          <source src={url} type="video/webm"></source>
          
        </video>        
      </div>

    )
  }
  renderYoutube(url) {
    url = addProtocol(url)
    url = fixYoutubeUrl(url)
    return (
      <div className="media-frame">
        <iframe className="media-youtube" 
          width="700"
          height="400"
          allowFullScreen
          frameBorder="0"
          src={`${url}?modestbranding=1&autohide=1&showinfo=0`}>
        </iframe>
      </div>
    )
  }

  renderImage(url) {
    return (
      <div className="media-frame">
        <img className="media-image" src={url}/>
      </div>
    )
  }

  render() {
    const {mediaType, url} = this.props
    switch(mediaType) {
      case 'video':
        return this.renderVideo(url)
      case 'youtube':
        return this.renderYoutube(url)
      case 'image':
      case 'gif':
        return this.renderImage(url)
      default:
        return <span className="media-error">Media type error</span>
    }

  }
} 

export default Media