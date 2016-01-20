"use strict";
var r = require('rethinkdb')
var parse = require('co-body')

// var binId =  'ed69b97c-cd29-4f70-9c0a-34d01dddf7ce'
// var userId = '0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216'
// var lastViewed = 1452934637635


// Return all posts 
module.exports.all = function *all(next) {
  console.log(this.query)
  // let { binId, userId } = this.query
  var binId = this.query.binId
  var userId = this.query.userId
  var lastViewed = this.query.lastViewed || Date.now()
  var postsPerPage = 10
  var pageNum = this.query.pageNum || 0
  if (!binId || !userId) {
    this.body = 'Please make sure to pass a bin and user ID'
  } else {
    var fetch = r.table('posts')
      .between([binId, r.minval], [binId, r.maxval], {index: 'binId_createdAt'})
      .orderBy({index: r.desc('binId_createdAt')})
      .filter(function (post) {
        return post("createdAt").lt(lastViewed);
      })
      .skip(postsPerPage*pageNum)
      .limit(postsPerPage)
      .run(this._rdbConn)
    try{
      var cursor = yield fetch
      var result = yield cursor.toArray()
      this.body = JSON.stringify(result)
    }
    catch(e) {
      this.status = 500
      this.body = e.message || http.STATUS_CODES[this.status]
    }
  }

  
}

// Create a new post  
module.exports.create = function *all(next) {
  try{
    var post = yield parse(this)
    post.createdAt = r.now().toEpochTime() // Set the field `createdAt` to the current time
    console.log(post)

    // Insert a new post
    var result = yield r.table('posts').insert(post, {returnChanges: true}).run(this._rdbConn)

    post = result.new_val // post now contains the new post + a field `id` and `createdAt`
    this.body = JSON.stringify(post)
  }
  catch(e) {
    this.status = 500
    this.body = e.message || http.STATUS_CODES[this.status]
  }
}


// Toggle a reaction
module.exports.toggleReaction = function *all(next) {
  try{
    var post = yield parse(this)
    post.createdAt = r.now().toEpochTime() // Set the field `createdAt` to the current time
    console.log(post)

    // Insert a new post
    var result = yield r.table('posts').insert(post, {returnChanges: true}).run(this._rdbConn)

    post = result.new_val // post now contains the new post + a field `id` and `createdAt`
    this.body = JSON.stringify(post)
  }
  catch(e) {
    this.status = 500
    this.body = e.message || http.STATUS_CODES[this.status]
  }
}





