import React, {Component} from 'react'
import Post from './Post'

class Posts extends Component {
  render() {

    const {dispatch, posts, currentUser} = this.props

    const sortArr = (arr) => {
      return arr.sort( (a,b)=> b-a )
    }

    return (
      <div>
        {sortArr(Object.keys(posts)).map( postId => {
          return <Post key={postId} dispatch={dispatch} currentUser={currentUser} post={posts[postId]} />
        })}
      </div>
    )
  }
} 

export default Posts