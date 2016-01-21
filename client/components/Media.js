import React, {Component} from 'react'

class Media extends Component {
  
  renderYoutube(url) {
    return (
      <div className="media-frame">
        <iframe className="media-youtube" width="700" height="380" src={url}></iframe>
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

Media.propTypes = {
  mediaType: React.PropTypes.string.isRequired,
  url: React.PropTypes.string.isRequired
}

export default Media