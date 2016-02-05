import React from 'react';
import {connect} from 'react-redux';
import {routeActions} from 'react-router-redux'

import Posts from '../components/Posts'
import Error from '../components/Error'
import JoinBin from '../components/JoinBin'
import CreateBin from '../components/CreateBin'

import {_throttle, findById} from '../helpers/utils'
import {fetchPosts, fetchPostsIfNeeded} from '../actions/posts'
import {checkBinExists} from '../actions/bins'

class Bin extends React.Component {

  constructor(props) {
    super(props);
    const {environment} = this.props
    this.state = {
      error: environment.error
    }
  }

  componentWillMount() {
    const {dispatch, auth, params} = this.props
    const {binId} = params
    dispatch(checkBinExists(binId))
    if (!auth.user) { dispatch(routeActions.push('/')) }
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch, params} = this.props
    const {binId} = params

    const newBinId = nextProps.params.binId
    // update local state with new view error from redux
    this.setState({error:nextProps.environment.error})

    if (binId !== newBinId) {
      dispatch(checkBinExists(binId))
    }
  }

  renderContent() {
    const {dispatch, auth, bin, params, posts, routing} = this.props
    const {binId} = params
    
    if (!bin.checked) { return; }

    // logged out, bin exists => show join
    // logged out, bin doesn't exist => show create
    if (!auth.user) {
      return bin.exists ? <JoinBin {...this.props} /> : <CreateBin {...this.props} />
    }

    const isMember = findById(auth.user.bins, binId)
    // logged in
    if (auth.user) {
      // bin doesn't exist => show create
      if (!bin.exists) {
        return <CreateBin {...this.props} />
      }
      // bin exists, member => show posts
      // bin exists, not member => show join
      if (bin.exists) {
        return isMember ? <Posts {...this.props} /> : <JoinBin {...this.props} />
      }
    }
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
  const {auth, bin, environment, modal, posts, reactions, routing} = state
  return {auth, bin, environment, modal, posts, reactions, routing}
}

export default connect(mapStateToProps)(Bin)
