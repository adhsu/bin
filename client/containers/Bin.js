import React from 'react';
import {connect} from 'react-redux';

import Posts from '../components/Posts'
import Error from '../components/Error'
import BinPasswordInput from '../components/BinPasswordInput'

import {_throttle, findById} from '../helpers/utils'
import {binSelector} from '../selectors/binSelector'
import {fetchPosts, fetchPostsIfNeeded} from '../actions/posts'
import {fetchBin} from '../actions/bins'

class Bin extends React.Component {

  constructor(props) {
    super(props);
    const {environment} = this.props
    
    this.state = {
      error: environment.error,
    }
    
  }

  componentWillMount() {
    const {dispatch, auth, params, environment, posts, bins} = this.props
    const {binId} = params

    // go to a new bin -> fetch limited details for that bin
    if (auth.user && !(findById(auth.user.bins, binId))) {
      console.log('you are not in this bin, fetch bin')
      dispatch(fetchBin(binId))
    }
  }


  componentWillReceiveProps(nextProps) {
    const {dispatch} = this.props
    // update local state with new view error from redux
    this.setState({error:nextProps.environment.error})

    const numNewPosts = nextProps.posts.length - this.props.posts.length
    if (numNewPosts<5 && numNewPosts>0) {
      this.setState({hasMore: false})
    }
  }

  renderContent() {
    const {dispatch, auth, params, posts, bins, routing} = this.props
    const {binId} = params
    
    if (!auth.user) { 
      return (
        <BinPasswordInput {...this.props} />
      )
    }

    const isMemberOfBin = findById(auth.user.bins, binId)
    if (!isMemberOfBin) {
      return (
        <BinPasswordInput {...this.props} />
      )
    }
    return (
      <div>
        <Posts {...this.props} />
      </div>
    )
  }

  renderError() {
    const {auth} = this.props
    if (!auth.user) { 
      return; 
    }
    return (
      <div>
        { this.state.error!=="" ? <Error onClickFn={()=>this.setState({error: ""})} message={this.state.error}/> : null}
      </div>
    )
  }

  render() {
    const {dispatch, params, posts} = this.props
    return (
      <div>
        {this.renderError()}
        {this.renderContent()}
        
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {auth, environment, modal, posts, routing} = state
  return {auth, environment, modal, posts, routing}
}

export default connect(mapStateToProps)(Bin)
