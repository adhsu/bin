import {r, type, Errors} from'./../utils/thinky.js'

var Bin = require('./../models/bins')
var Post = require('./../models/posts')
var User = require('./../models/users')

// createPost
// POST /api/posts
// query params {auth_token}
// body {binId, url, title, mediaType}
// => {post}
export function createPost(req, res) {
  //security assumption: bin exists and user is in that bin
  const binId = req.body.binId
  const postBody = req.body
  postBody.authorId = req.token.id
  postBody.reactions = []

  const post = new Post(postBody)
  post.save().then(function(result){
    res.json(result)
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
    if (post.authorId == currentUserId) {
      post.delete().then(function(result){
        return res.json({ok: true})
      })
    } else {
      return res.json({
        ok: false, 
        message: 'you are not the author of this post'
      })
    }
  })
}

// fetchPosts
// GET /api/posts
// query params {binId, /lastViewed, offset, limit/, token}
// => bin passed: [{post}]

export function fetchPosts(req, res) {
  const binId = req.query.binId
  const lastViewed = +req.query.lastViewed || Date.now()
  const offset = +req.query.offset || 0
  const limit = +req.query.limit || 3

  Post.between([binId, r.minval], [binId, r.maxval], {index: "binId_createdAt"})
    .orderBy({index: r.desc('binId_createdAt')})
    .getJoin({reactions: true})
    .filter(function (post) {
      return post("createdAt").lt(lastViewed);
    })
    .skip(offset)
    .limit(limit)
    .run().then(function(posts) {

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

