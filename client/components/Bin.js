import React from 'react';
import {connect} from 'react-redux';

import Posts from './Posts'
import NoPosts from './NoPosts'
import Modal from './Modal'
import Error from './Error'
import Loading from './Loading'

import {handlePaste} from '../helpers/pasteHelpers'
import {_throttle} from '../helpers/utils'
import {binSelector} from '../selectors/binSelector'
import {fetchPostsIfNeeded, fetchPosts} from '../actions/posts'


class Bin extends React.Component {

  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    const {dispatch, view} = this.props
    
    this.state = {
      modalIsOpen: false,
      error: view.error,
      page: 0,
      hasMore: true
    }

    this.boundHandlePaste = handlePaste.bind(this, dispatch)
    
  }

  componentWillMount() {
    const {dispatch, params, currentUser, view} = this.props

    document.addEventListener('paste', this.boundHandlePaste);
    document.addEventListener('scroll', _throttle(
      () => {
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop
        const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight
        const scrolledToBottom = (scrollTop + window.innerHeight) >= scrollHeight
        
        console.log(this.state.hasMore)
        if (scrolledToBottom && !this.props.view.isLoading && this.state.hasMore) { 
          console.log('**inf scroll**')
          dispatch(
            fetchPosts({
              slug: params.slug, 
              userId: currentUser.id, 
              page: this.state.page+1,
              postsPerPage: 5
            })
          )
          this.setState({page: this.state.page+1})
          
        }
        
      }, 500)
    )

  }

  componentDidMount() {
    const {dispatch, params, currentUser} = this.props
    dispatch(
      fetchPostsIfNeeded({
        slug: params.slug, 
        userId: currentUser.id, 
        page: 0,
        postsPerPage: 5
      })
    )
  }

  componentWillUnmount() {
    document.removeEventListener('paste', this.boundHandlePaste);
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch} = this.props
    // update local state with new view error from redux
    this.setState({error:nextProps.view.error})
    console.log('bin receives new props ', this.props, nextProps)

    const numNewPosts = nextProps.posts.length - this.props.posts.length
    if (numNewPosts<5 && numNewPosts>0) {
      this.setState({hasMore: false})
    }

    if (this.props.params.slug !== nextProps.params.slug) {
      console.log('you clicked on a new bin ', this.props.params.slug, nextProps.params.slug)
      const { dispatch, params, currentUser } = nextProps
      // switching to a new bin, get posts
      dispatch(
        fetchPostsIfNeeded({
          slug: params.slug, 
          userId: currentUser.id, 
          page: 0,
          postsPerPage: 5
        })
      )

    }

  }

  closeModal() {
    this.setState({modalIsOpen: false, validPost: null})
  }

  render() {
    const {dispatch, view, params, posts, routing} = this.props
    return (
      <div>
        <div>http://i.imgur.com/Q9NkfmE.gif</div>
        
        { this.state.error!=="" ? <Error onClickFn={()=>this.setState({error: ""})} message={this.state.error}/> : null}
        
        <Posts {...this.props} />
        { posts.length==0 && !view.isLoading ? <NoPosts/> : null}
        
        { view.isLoading ? <Loading className="centered" /> : null }
        

        {!this.state.hasMore ? <h1>You've reached the bottom.</h1> : null}

        {this.state.modalIsOpen ? <Modal params={params} closeModal={this.closeModal} {...this.state.validPost}/> : null}
        
      </div>
      
    )
  }
}

export default connect(binSelector)(Bin)
