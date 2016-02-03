import React, {Component} from 'react'
import Modal from '../containers/Modal'
import Post from './Post'
import NoPosts from './NoPosts'
import Loading from '../components/Loading'
import {_throttle, findById} from '../helpers/utils'
import {fetchPostsIfNeeded} from '../actions/posts'
import {handlePaste} from '../actions/paste'
import {updateUser} from '../actions/auth'

class Posts extends Component {
  constructor(props) {
    super(props)
    
    this.state = {
      page: 0,
      hasMore: true
    }
    
    this.scrollHandler = this.scrollHandler.bind(this)
    this.pasteHandler = this.pasteHandler.bind(this)
  }

  componentWillMount() {
    const {dispatch, posts, params} = this.props
    dispatch(updateUser({lastViewedBin: params.binId}))
    // if (!(params.binId in posts.items) || posts.items[params.binId].length == 0) {
    //   console.log('lets fetch if needed')
    //   dispatch(fetchPostsIfNeeded(params.binId))
    // }

    document.addEventListener('paste', this.pasteHandler);
    // document.addEventListener('scroll', this.scrollHandler);
    
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch, posts, params} = this.props
    const newBinId = nextProps.params.binId
    if (params.binId !== newBinId) {
      dispatch(updateUser({lastViewedBin: newBinId}))
      if (!(newBinId in posts.items) || posts.items[newBinId].length == 0) {
        console.log('lets fetch if needed 2')
        dispatch(fetchPostsIfNeeded(newBinId))
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('paste', this.pasteHandler);
    document.removeEventListener('scroll', this.scrollHandler);
  }

  pasteHandler(event) {
    console.log('pasted is ', event.clipboardData.getData('text'))
    const {dispatch} = this.props
    dispatch(handlePaste(event))
  }

  scrollHandler() {
    return _throttle(
      () => {
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
        const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight
        const scrolledToBottom = (scrollTop + window.innerHeight) >= scrollHeight
        
        if (scrolledToBottom && !this.props.posts.isFetching && this.state.hasMore) { 
          console.log('**inf scroll**')
          // dispatch(
          //   fetchPostsIfNeeded({
          //     slug: params.slug, 
          //     userId: currentUser.id, 
          //     page: this.state.page+1,
          //     postsPerPage: 5
          //   }, true)
          // )
          this.setState({page: this.state.page+1})
          
        }
      }, 500)
  }

  renderPosts() {
    const {dispatch, auth, posts, params} = this.props
    const {binId} = params
    const postsInBin = binId in posts.items ? posts.items[binId] : []
    
    if (postsInBin.length==0 && !posts.isFetching) {
      return (
        <NoPosts/>
      )
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
                post={post} />
            )
          })
        }
        {this.state.hasMore && !posts.isFetching ? <p className="reached-bottom u-textCenter">You've reached the bottom.</p> : null}
      </div>
    )
  }

  render() {
    const {dispatch, auth, posts, params, modal} = this.props
    const {binId} = params
    return (
      <div>
        {this.renderPosts()}
        { posts.isFetching ? <Loading className="centered" /> : null }
        { modal.isOpen ? <Modal params={params} /> : null }
      </div>
    )
  }
} 

export default Posts
