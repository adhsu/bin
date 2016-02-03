import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux';

import Media from '../components/Media'
import Loading from '../components/Loading'

import {createPost} from '../actions/posts'
import {fetchTitle, resetModal} from '../actions/modal'
import {API_BASE_URL} from '../constants/Config'

class Modal extends Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentWillMount() {
    const {dispatch, modal} = this.props
    const {validPost} = modal
    dispatch(fetchTitle(validPost.url))

    document.addEventListener('keyup', this.handleKeyUp);
    document.body.classList.add('modal-open')
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUp);
    document.body.classList.remove('modal-open')
  }

  componentWillReceiveProps(nextProps) {
    const title = nextProps.modal.fetchedTitle
    const isLoadingTitle = nextProps.modal.isLoadingTitle
    console.log('new props, title is ', title, isLoadingTitle)
    if (this.props.modal.isLoadingTitle && !isLoadingTitle) {
      if (title && title!=="") { this.refs.title.value = title }
      this.refs.title.focus()
    }
    
  }

  handleKeyUp(e) {
    const {dispatch} = this.props
    switch(e.which) {
      case 13: // enter
        this.submit()
        return null
      case 27: // esc
        dispatch(resetModal())
        return null
      default:
        return null
    }
  }

  submit() {
    const {dispatch, auth, params, modal} = this.props
    const {validPost} = modal
    const {url, mediaType} = validPost
    const {binId} = params

    const post = {
      binId,
      url,
      mediaType,
      title: this.refs.title.value.trim(),
    }
    dispatch(createPost(post))
  }

  renderSubmit() {
    const { posts } = this.props
    if (posts.isCreating) {
      return (
        <div className="modal-submit-wrapper">
          <Loading className="modal-submit-loading" size="25" />
        </div>
      )
    } else {
      return (
        <div className="modal-submit-wrapper">
          <div className="modal-submit" onClick={this.submit}>Press ⏎ to submit</div>
        </div>
      )  
    }
  }

  render() {
    const {dispatch, modal} = this.props
    const {validPost} = modal
    const {url, mediaType} = validPost
    return (
      <div className="modal-backdrop" onClick={e=>dispatch(resetModal())}>
        <div className="modal-content" onClick={e=>e.stopPropagation()}>
          <div className="modal-top">
            <div className="modal-top-left">
              You pasted:
              {' '}
              <span className="modal-url">{url}</span>
            </div>
            <div className="modal-top-right">
              <div className="modal-close" onClick={e=>dispatch(resetModal())}>Esc to close</div>
            </div>
          </div>

          <div className="modal-title-input-wrapper">
            <input className="modal-title-input" type="text" ref="title" />
            { modal.isLoadingTitle ? <Loading className="modal-title-input-loading" size="35" /> : null}
          </div>
        
          { mediaType ? <Media mediaType={mediaType} url={url}/> : null }
          {this.renderSubmit()}
        </div>
      </div>
    )
  }
} 

function mapStateToProps(state) {
  const {auth, posts, modal} = state
  return {
    auth,
    posts,
    modal
  }
}

export default connect(mapStateToProps)(Modal)
