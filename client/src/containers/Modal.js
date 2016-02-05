import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux';

import Media from '../components/Media'
import Loading from '../components/Loading'

import {createPost} from '../actions/posts'
import {fetchMeta, resetModal} from '../actions/modal'
import {API_BASE_URL} from '../constants/Config'

class Modal extends Component {

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentWillMount() {
    const {dispatch, modal} = this.props
    dispatch(fetchMeta(modal.url))

    document.addEventListener('keyup', this.handleKeyUp);
    document.body.classList.add('modal-open')
  }

  componentWillUnmount() {
    document.removeEventListener('keyup', this.handleKeyUp);
    document.body.classList.remove('modal-open')
  }

  componentWillReceiveProps(nextProps) {
    
    const nextModal = nextProps.modal
    if (this.props.modal.isLoadingMeta && !nextModal.isLoadingMeta && nextModal.meta) {
      const title = nextModal.meta.ogTitle || nextModal.meta.title
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
    const {url, mediaType} = modal
    const {binId} = params

    const post = {
      binId,
      url,
      mediaType,
      title: this.refs.title.value.trim(),
      meta: modal.meta
    }
    dispatch(createPost(post))
  }

  renderSubmit() {
    const { posts, params } = this.props
    const { binId } = params
    if (posts[binId].isCreating) {
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
    const {url, mediaType} = modal
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

          <div className="modal-meta-input-wrapper">
            <input className="modal-meta-input" type="text" ref="title" />
            { modal.isLoadingMeta ? <Loading className="modal-meta-input-loading" size="35" /> : null}
          </div>
        
          { mediaType ? <Media mediaType={mediaType} meta={modal.meta} url={url}/> : null }
          {this.renderSubmit()}
        </div>
      </div>
    )
  }
} 

function mapStateToProps(state) {
  const {auth, posts, meta, modal} = state
  return {
    auth,
    posts,
    modal
  }
}

export default connect(mapStateToProps)(Modal)
