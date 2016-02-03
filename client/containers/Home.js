import React from 'react'
import {connect} from 'react-redux';

class Home extends React.Component {
  
  renderWelcome() {
    const {auth} = this.props
    if (!auth.user) {
      return (
        <div>
          <p>Share pictures, videos, and links with your close friends.</p>
          <p>Sign in with Twitter to use Bin.</p>
        </div>
      )
    }
    
    return (
      <p>
        Welcome to Bin, {auth.user.name}.
      </p>
    )
  }

  render() {
    const {auth} = this.props
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
