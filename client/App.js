import React from 'react'
import {connect} from 'react-redux'
import {routeActions} from 'redux-simple-router'
import Nav from './components/Nav'
import {initEnvironment} from './actions/environment';

class App extends React.Component {

  componentDidMount () {
    const {dispatch} = this.props;
    dispatch(initEnvironment())
  }

  render() {
    const {params} = this.props
    return (
      <div>
        <Nav slug={params.slug} />
        <div className="container">
          {this.props.children}
        </div>
        
      </div> 
    )
  }
}


function mapStateToProps(state) {
  return state
  // const {currentUser, view} = state;
  // return { currentUser, view }
}

export default connect(mapStateToProps)(App);
