import React, {Component} from 'react'
import Modal from '../containers/Modal'
import Post from './Post'
import NoPosts from './NoPosts'
import Loading from '../components/Loading'
import {_debounce, _throttle, findById, scrolledToBottom} from '../helpers/utils'
import {editBinTitle} from '../actions/bins'
import {fetchPostsIfNeeded, fetchPosts} from '../actions/posts'
import {handlePaste} from '../actions/paste'
import {updateUser} from '../actions/auth'
import {POSTS_PER_PAGE} from '../constants/Config'

class Posts extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      editingTitle: false,
    }
    this.renderTitle = this.renderTitle.bind(this)
    this.startEditTitle = this.startEditTitle.bind(this)
    this.editTitle = this.editTitle.bind(this)
    this.throttledScroll = this.throttledScroll.bind(this)
    this.pasteHandler = this.pasteHandler.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  componentWillMount() {
    const {dispatch, posts, params} = this.props
    const {binId} = params
    dispatch(updateUser({lastViewedBin: binId}))
    console.log('check', binId, posts)
    if (!(binId in posts) && !posts[binId]) {
      console.log('lets fetch if needed')
      dispatch(fetchPostsIfNeeded(params.binId))
    }

    document.addEventListener('paste', this.pasteHandler);
    document.addEventListener('scroll', this.throttledScroll);
    
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch, posts, params} = this.props
    const newBinId = nextProps.params.binId
    if (params.binId !== newBinId) {
      dispatch(updateUser({lastViewedBin: newBinId}))
      if (!(newBinId in posts) || posts[newBinId].length == 0) {
        console.log('lets fetch if needed 2')
        dispatch(fetchPostsIfNeeded(newBinId))
      }
    }

  }

  componentDidUpdate(prevProps, prevState) {
    const {auth, params} = this.props
    const {binId} = params
    const binTitle = findById(auth.user.bins, binId).title
    if (this.state.editingTitle) {
      this.refs.editTitleInput.value = binTitle
      this.refs.editTitleInput.focus()
    }
    
  }
  componentWillUnmount() {
    document.removeEventListener('paste', this.pasteHandler);
    document.removeEventListener('scroll', this.throttledScroll);
  }

  handleKeyUp(e) {
    switch(e.which) {
      case 27: // esc
        console.log('key up', e.which)
        this.setState({editingTitle: false})
        return null
      default:
        return null
    }
  }

  pasteHandler(event) {
    console.log('pasted is ', event.clipboardData.getData('text'))
    const {dispatch} = this.props
    dispatch(handlePaste(event))
  }

  throttledScroll = _throttle(() => {
    const {dispatch, auth, posts, params} = this.props
    const {binId} = params
    const bottom = scrolledToBottom(10)
    if(bottom) { console.log('scrollbottom', bottom) }
    
    if (bottom && !posts[binId].isFetching && posts[binId].hasMore) { 
      console.log('**inf scroll**')
      dispatch(fetchPosts(
        auth.token, 
        params.binId,
        Date.now(), 
        POSTS_PER_PAGE*posts[binId].page, // offset
        POSTS_PER_PAGE // limit
      ))      
    }
  }, 200);

  renderPosts() {
    const {dispatch, auth, posts, params, reactions} = this.props
    const {binId} = params
    const postsInBin = binId in posts ? posts[binId].items : []
    console.log('ppp', posts, binId, postsInBin)
    
    if (postsInBin.length==0 && posts[binId]) {
      if (!posts[binId].isFetching) {
        return (
          <NoPosts/>
        )
      }
    }
    
    return (
      <div>
        {
          postsInBin.map(post => {
            return (
              <Post
                key={post.id}
                auth={auth}
                dispatch={dispatch}
                post={post}
                reactions={reactions} />
            )
          })
        }
        { this.renderBottom() }
        
      </div>
    )
  }

  renderBottom() {
    const {posts, params} = this.props
    const {binId} = params
    if (posts[binId]) {
      if (!posts[binId].hasMore && !posts[binId].isFetching && posts[binId].page>0) {
        return <p className="reached-bottom u-textCenter">You've reached the bottom.</p>
      }
    }
    return;
  }

  startEditTitle(e) {
    this.setState({editingTitle: true})
    
  }

  editTitle(e) {
    e.preventDefault()
    const {dispatch, params} = this.props
    const {binId} = params
    const newTitle = this.refs.editTitleInput.value
    dispatch(editBinTitle(binId, newTitle))
    this.setState({editingTitle: false})
  }

  renderTitle() {
    const {auth, params} = this.props
    const {binId} = params
    const binTitle = findById(auth.user.bins, binId).title

    if (this.state.editingTitle) {
      return (
        <div className='bin-title-wrapper'>
          <form onSubmit={this.editTitle}>
            <input 
              className="bin-title-input"
              type="text"
              ref="editTitleInput"
              onKeyUp={this.handleKeyUp} />
          </form>
        </div>
      )
    } else {
      return (
        <div className='bin-title-wrapper'>
          <div className="bin-title" onClick={e=>this.startEditTitle(e)}>
            {binTitle}
          </div>
        </div>
      )
    }
  }

  render() {
    const {posts, params, modal} = this.props
    const {binId} = params
    return (
      <div>
        <div className="bin-title-wrapper">
          {this.renderTitle()}
        </div>
        
        { this.renderPosts() }
        { posts[binId] && posts[binId].isFetching ? <Loading className="centered" /> : null }
        { modal.isOpen ? <Modal params={params} /> : null }
      </div>
    )
  }
} 

export default Posts
