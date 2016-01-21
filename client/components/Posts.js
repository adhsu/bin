import React, {Component} from 'react'
import Post from './Post'
import NoPosts from './NoPosts'

class Posts extends Component {
  render() {

    const {dispatch, posts, currentUser, view, bins} = this.props
    const sortArr = (arr) => {
      return arr.sort( (a,b)=> b-a )
    }

    return (
      <div>
        { posts.length > 0 ?
          posts.map((post, index) => {
            return (
              <Post
                key={post.id}
                index={index}
                dispatch={dispatch}
                currentUser={currentUser}
                bins={bins}
                post={post} />
            )
          })
          : null
        }

      </div>
    )
  }
} 

export default Posts