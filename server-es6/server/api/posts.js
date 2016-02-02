import {r, type, Errors} from'./../utils/thinky.js'

var Bin = require('./../models/bins')
var Post = require('./../models/posts')
var User = require('./../models/users')


// createPost
// POST /api/posts
// query params {userId, auth_token}
// body {binId, url, title, mediaType, authorId}
// => {post}
export function createPost(req, res) {

  //security assumption: bin exists and user is in that bin

  const binId = req.body.binId
  const postBody = req.body
  const userId = req.token.id

  if (userId != req.body.authorId) {
    return res.json({"err": "Body's author not that authenticated author"})
  }
  
  postBody.reactions = []

  const post = new Post(postBody)

  post.save().then(function(result){
    res.json({result})
  })


}


// deletePost
// DELETE /api/posts/:id
// query params {auth_token}
// => {ok:true}
export function deletePost(req, res) {
  // check if currentUser is the author of post 
  var currentUserId = req.token.id
  var postId = req.params.postId

  Post.get(postId).run().then(function(post){
    if(post.authorId == currentUserId) {
      post.delete().then(function(result){
        return res.json({ok: true})
      })
    } else {
      return res.json({ok: false})
    }
    
  })


}

// fetchPosts
// GET /api/posts
// query params {binId, /lastViewed, offset, limit/, token}
// => bin passed: [{post}]

export function fetchPosts(req, res) {
  const binId = req.query.binId

  Post.filter({binId: binId}).getJoin({
    reactions: true
  }).run().then(function(posts) {

    // Go through every post object and flatten the reactions array

    posts = posts.map(
      function(post) {

        const reactions = {}
        for (const reaction of post.reactions) {
          // iterate through all reactions within a specific post
          if(reactions.hasOwnProperty(reaction.emojiId)){
            reactions[reaction.emojiId]++ 
          } else {
            reactions[reaction.emojiId] = 1
          }
        }
        post.reactions = reactions
        return post
      }
    )
    res.json(posts)
  })

  // Bin.get(binId).getJoin().run().then(function(bin){
  //   res.json(bin.posts)
  // }).catch(Errors.DocumentNotFound, function(err) {
  //   res.json({err: 'Bin does not exist.'})
  // })
}

