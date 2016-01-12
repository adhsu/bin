import React, {Component} from 'react'
import {connect} from 'react-redux';
import Media from './Media'
import {submitNewPost} from '../actions'

class Modal extends Component {

  constructor(props) {
    super(props);
    this.submitPost = this.submitPost.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    
    this.state = {
      fetchedTitle: "",
      titleIsLoading: true
    }
    
  }

  asyncFetchTitle(url) {
    // return fetch('http://textance.herokuapp.com/title/www.bbc.co.uk').then(function(response){return response.text()}).then(function(text){console.log(text)})
    return fetch('http://textance.herokuapp.com/title/' + url).then(function(response){return response.text()}).then(function(text){console.log(text)})
    return fetch(url, {
      method: 'get',
      mode: 'no-cors'
    }).then(response => {
      // console.log(Promise.resolve(response))
      console.log(response)
      console.log(response.text)
      return response.text()
      // this.refs.title.value = title 
    }).then(text => {
      console.log(text)
      this.setState({titleIsLoading : false})
      return text
    })
    // .then((response) => {
    //   console.log(response)
    //   return response.text()
    // })
  }

  componentDidMount() {
    const {url} = this.props

    this.asyncFetchTitle(url)


    document.addEventListener('keyup', this.handleKeyUp);
    document.body.classList.add('modal-open')
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUp);
    document.body.classList.remove('modal-open')
  }

  handleKeyUp(e) {
    switch(e.which) {
      case 13:
        // enter
        this.submitPost()
      case 27:
        // esc
        this.props.closeModal()
      default:
        return null
    }
  }

  submitPost() {
    const {dispatch, title, url, timestamp, mediaType, closeModal} = this.props
    const newPostData = {
      id: timestamp,
      url,
      timestamp,
      mediaType,
      title: this.refs.title.value.trim(),
      reactions: []
    }
    closeModal()
    dispatch(submitNewPost(newPostData))
  }

  render() {

    const {url, timestamp, mediaType, closeModal} = this.props

    return (
      <div className="modal-backdrop" onClick={closeModal}>
        <div className="modal-content" onClick={e=>e.stopPropagation()}>
          <div className="modal-top">
            <div className="modal-top-left">
              You pasted:
              {' '}
              <span className="modal-url">{url}</span>
            </div>
            <div className="modal-top-right">
              <div className="modal-close" onClick={closeModal}>Esc to close</div>
            </div>
          </div>

          <input className="modal-title-input" type="text" ref="title" autofocus/>
          { this.state.titleIsLoading ? <div>Loading</div> : null}
        
          { mediaType ? <Media mediaType={mediaType} url={url}/> : null }

          <div className="modal-submit" onClick={this.submitPost}>Press ⏎ to submit</div>
        </div>


      </div>
    )
  }
} 


function mapStateToProps(state) {
  return {}
}

export default connect(mapStateToProps)(Modal)
