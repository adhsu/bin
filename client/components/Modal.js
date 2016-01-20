import React, {Component} from 'react'
import {connect} from 'react-redux';

import Media from './Media'
import {submitNewPost} from '../actions/submit'
import Loading from './Loading'
import {modalSelector} from '../selectors/modalSelector'


class Modal extends Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    
    this.state = {
      fetchedTitle: "",
      titleIsLoading: true
    }
    
  }

  fetchTitle(url) {
    fetch(`http://10.0.1.187:3000/api/title/?url=${url}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
          this.refs.title.focus()
          console.log('fetch title network response not ok')
        }
      })
      .then(json => {
        console.log('fetchTitle ', url, json)
        if (this.refs.title) {
          console.log('state is ', this.state)
          this.refs.title.value = json.ogTitle || json.title
          this.setState({titleIsLoading : false})
        }
      })
      .catch(error => {
        this.setState({titleIsLoading : false})
        this.refs.title.focus()
        console.log('error with fetch title: ', error.message)
      })
  }

  componentDidMount() {
    const {url} = this.props

    this.fetchTitle(url)

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
        this.submit()
      case 27:
        // esc
        this.props.closeModal()
      default:
        return null
    }
  }

  submit() {
    const {dispatch, binSlug, currentUser, closeModal, title, url, mediaType} = this.props
    
    const post = {
      binSlug,
      url,
      mediaType,
      title: this.refs.title.value.trim(),
      author: currentUser.id
    }
    dispatch(submitNewPost(post))
    closeModal()
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

          <div className="modal-title-input-wrapper">
            <input className="modal-title-input" type="text" ref="title" />
            { this.state.titleIsLoading ? <Loading className="modal-title-input-loading" size="35" /> : null}
          </div>
        
          { mediaType ? <Media mediaType={mediaType} url={url}/> : null }

          <div className="modal-submit" onClick={this.submit}>Press ⏎ to submit</div>
        </div>


      </div>
    )
  }
} 

export default connect(modalSelector)(Modal);
