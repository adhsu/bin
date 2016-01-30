import React from 'react'
import {connect} from 'react-redux'

import {initEnvironment} from '../actions/environment'
import {initAuth} from '../actions/auth'
import {fetchBins} from '../actions/bins'

import Nav from './Nav'

class App extends React.Component {

  componentWillMount () {
    const {dispatch, params} = this.props;
    dispatch(initEnvironment())
    dispatch(initAuth())
  }

  render() {
    const {params} = this.props
    return (
      <div>
        <Nav params={params}/>
        <div className="container">
          {this.props.children}
        </div>        
      </div> 
    )
  }
}

function mapStateToProps(state) {
  return state
}

export default connect(mapStateToProps)(App);
