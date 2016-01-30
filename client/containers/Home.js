import React from 'react'
import {connect} from 'react-redux';

class Home extends React.Component {
  
  renderWelcome() {
    const {auth} = this.props
    if (!auth.user) {
      return (
        <p>Share pictures, videos, and links with your close friends.</p>
      )
    }
    
    return (
      <p>
        Welcome to Bin, {auth.user.username}.
      </p>
    )
  }

  render() {
    const {auth} = this.props
    console.log(auth)
    return (
      <div className="home u-textCenter">
        {this.renderWelcome()}
      </div>
    )
  }
}

function mapStateToProps(state) {
  const {auth} = state
  return {auth}
}

export default connect(mapStateToProps)(Home)
