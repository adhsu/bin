import React from 'react';
import {connect} from 'react-redux';
import Nav from './components/Nav'
import Posts from './components/Posts'
import Modal from './components/Modal'
import Error from './components/Error'
import {handlePaste} from './helpers/pasteHelpers'


class App extends React.Component {

  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    const {dispatch, view} = this.props
    
    this.state = {
      modalIsOpen: false,
      error: view.error
    }
    
    document.addEventListener('paste', handlePaste.bind(this, dispatch));
  }

  componentWillReceiveProps(nextProps) {
    // update local state with new view error from redux
    this.setState({error:nextProps.view.error})
  }

  closeModal() {
    this.setState({modalIsOpen: false, validPost: null})
  }

  render() {
    const {view} = this.props
    return (
      <div>
        { this.state.error!=="" ? <Error onClickFn={()=>this.setState({error: ""})} message={this.state.error}/> : null}
        <Nav/>
        <div className="container">
          <Posts {...this.props} />
        </div>
        
        {this.state.modalIsOpen ? <Modal closeModal={this.closeModal} {...this.state.validPost}/> : null}

      </div>
      
    )
  }
}

function mapStateToProps(state) {
  const {posts, currentUser, view} = state
  return {
    posts,
    currentUser,
    view
  }
}

export default connect(mapStateToProps)(App)
