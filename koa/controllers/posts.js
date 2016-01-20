"use strict"
var r = require('rethinkdb')
var parse = require('co-body')

var binId =  'ed69b97c-cd29-4f70-9c0a-34d01dddf7ce'
// var userId = '0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216'
// var lastViewed = 1452934637635


// Return all posts for a specific bin
// TODO: update lastViewed
module.exports.all = function *all(next) {
  // let { binSlug, userId } = this.query
  var binSlug = this.query.binSlug
  var userId = this.query.userId
  var lastViewed = +this.query.lastViewed || Date.now()
  var postsPerPage = +this.query.postsPerPage || 15
  var pageNum = +this.query.pageNum || 0
  if (!binSlug || !userId) {
    this.body = 'Please make sure to pass a bin and user ID'
  } else {
    var fetch = r.table('posts')
      .between([binSlug, r.minval], [binSlug, r.maxval], {index: 'binSlug_createdAt'})
      .orderBy({index: r.desc('binSlug_createdAt')})
      .filter(function (post) {
        return post("createdAt").lt(lastViewed);
      })
      .skip(postsPerPage*pageNum)
      .limit(postsPerPage)
      .run(this._rdbConn)

    var updatedBinObj = {"bins": {}}
      updatedBinObj["bins"][binId] = Date.now()

    var markLastViewed = r.table('users')
      .get(userId)
      .update(updatedBinObj)
      .run(this._rdbConn)

    try{
      // Fetch Post 
      var cursor = yield fetch
      var result = yield cursor.toArray()
      result = result.map(function(post) {
        for (var reactionKey in post.reactions) {
          var reactionArr = post.reactions[reactionKey]
          post.reactions[reactionKey] = {'num' : post.reactions[reactionKey].length}
          post.reactions[reactionKey]['userVoted'] = (reactionArr.indexOf(userId) != -1) ? true : false
        }
        return post
      })
      console.log(result)
      this.type = 'application/json'
      this.body = JSON.stringify(result)
    }
    catch(e) {
      this.status = 500
      this.body = e.message || http.STATUS_CODES[this.status]
    }
  }

  
}

// Create a new post  
module.exports.create = function *create(next) {
  try{
    var post = yield parse(this)
    post.binId = "ed69b97c-cd29-4f70-9c0a-34d01dddf7ce"
    post.reactions = {}
    post.createdAt = r.now().toEpochTime().mul(1000) // Set the field `createdAt` to the current time
    console.log(post)


    // Insert a new post
    var result = yield r.table('posts').insert(post, {returnChanges: true}).run(this._rdbConn)

    post = result.changes[0].new_val // post now contains the new post + a field `id` and `createdAt`
    this.type = 'application/json'
    this.body = JSON.stringify(post)
  }
  catch(e) {
    this.status = 500
    this.body = e.message || http.STATUS_CODES[this.status]
  }
}

// Delete a post  
module.exports.delete = function *del(next) {
  try{
    var body = yield parse(this)
    console.log(body.id)
    var result = yield r.table('posts').get(body.id).delete().run(this._rdbConn)

    this.type = 'application/json'
    this.body = JSON.stringify(result)
  }
  catch(e) {
    this.status = 500
    this.body = e.message || http.STATUS_CODES[this.status]
  }
}


// Toggle a reaction
module.exports.toggleReaction = function *toggleReaction(next) {
  var postId = this.query.postId
  var userId = this.query.userId
  var emojiId = this.query.emojiId

  if (!postId || !userId || !emojiId) {
    this.body = 'Please make sure to pass a post, user, and emoji ID'
  } else {
    // find the post in question
    // check if a user has access to the post's bin
    // then modify the post to either add or remove emoji and uservoted 
    var fetchPost = r.table('posts')
      .get(postId)
      .run(this._rdbConn)

      // still need to make sure userId is authenticated
    var isUserInBin = function(binId){
      return r.table('users').get(userId)("bins").contains(binId).run(this._rdbConn)
    }.bind(this)

    try{
      var post = yield fetchPost
      // var userHasBin = yield isUserInBin(post.binId)
      if (yield isUserInBin(post.binId)) {

        // console.log(post.reactions[emojiId], userId)
        if (post.reactions[emojiId] && post.reactions[emojiId].indexOf(userId) != -1 && post.reactions[emojiId].length > 0) {
          var userReactionIndex = post.reactions[emojiId].indexOf(userId)
          // remove reaction vote 
          if (post.reactions[emojiId].length > 1) {
            post.reactions[emojiId].splice(userReactionIndex, 1)
          } else {
            // remove the last of that reaction
            delete post.reactions[emojiId]
          }
        } else {
          // add reaction vote 
          if (!post.reactions[emojiId]) {
            post.reactions[emojiId] = []
          }
          post.reactions[emojiId].push(userId)
        }

        var result = yield r.table('posts').get(postId).update({"reactions" : r.literal(post.reactions)}, {returnChanges: true}).run(this._rdbConn)
        
        if (result.changes.length > 0) {
          post = result.changes[0].new_val 
          this.body = JSON.stringify(post)
        } else {
          this.body = 'no change?' 
        }
        
      } else {
        this.body = 'no!'
      }

    }
    catch(e) {
      this.status = 500
      this.body = e.message || http.STATUS_CODES[this.status]
    }
  }
  
}





