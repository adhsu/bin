import React, {Component} from 'react'
import {addProtocol, getImgurId, fixYoutubeUrl, getSpotifyId, limitText} from '../helpers/utils'


class Media extends Component {
  constructor() {
    super()
    this.state = {}
  }

  componentWillMount() {
    const {mediaType, meta, url} = this.props
    if (mediaType=='soundcloud') {
      fetch(`http://soundcloud.com/oembed?format=json&url=${url}`)
        .then(response => response.json())
        .then(json => {
          // console.log('soundcloud oembed response', json)
          this.setState({
            scEmbed: {
              __html: json.html
            }
          })
        })
        .catch(err => { throw err; })
    }

    if (mediaType=='vimeo') {
      fetch(`https://vimeo.com/api/oembed.json?url=${url}`)
        .then(response => response.json())
        .then(json => {
          // console.log('vimeo oembed response', json)
          this.setState({
            vimeoEmbed: {
              __html: json.html
            }
          })
        })
        .catch(err => { throw err; })
    }
  }

  renderSpotify(url) {
    const spotifyId = getSpotifyId(url)
    return (
      <div className="media-frame">
        <iframe className="media-spotify" src={`https://embed.spotify.com/?uri=spotify:track:${spotifyId}`}frameBorder="0"
          allowTransparency="true">
        </iframe>
      </div>
    )
  }

  renderVideo(url) {
    url = addProtocol(url)
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
    url = addProtocol(url)
    return (
      <div className="media-frame">
        <img className="media-image" src={url}/>
      </div>
    )
  }

  render() {
    const {mediaType, meta, url} = this.props
    switch(mediaType) {
      case 'spotify':
        return this.renderSpotify(url)
      case 'soundcloud':
        return (
          <div className="media-frame">
            <div className="media-soundcloud" dangerouslySetInnerHTML={this.state.scEmbed}></div>
          </div>
        )
      case 'vimeo':
        return (
          <div className="media-frame">
            <div className="media-vimeo" dangerouslySetInnerHTML={this.state.vimeoEmbed}></div>
          </div>
        )
      case 'video':
        if (meta) {
          if (meta.animated) {
            return this.renderVideo(meta.webm)
          }
        } else {
          return this.renderVideo(url)
        }
      case 'youtube':
        return this.renderYoutube(url)
      case 'image':
      case 'gif':
        if (meta) {
          if (meta.link) {
            return this.renderImage(meta.link)
          }
        }
        return this.renderImage(url)
      
      case 'album':
      case 'link':
        return <p className="media-link-description">{limitText(meta.ogDescription || meta.description, 200)}</p>;
      default:
        return <span className="media-error">Media type error</span>
    }

  }
} 

export default Media