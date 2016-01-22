"use strict"
var r = require('rethinkdb')
var parse = require('co-body')
var constUserId = "0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216"

// Get all Bins with user object filled out
module.exports.getBins = function *getBins() {
  var userId = this.query.userId || constUserId
  try {
    var cursor = yield r.table('bins').getAll(
        r.args(r.table('users').get(userId)("bins").keys()),
        {index: 'slug'}
      ).merge(function (bin) {
      return { users: bin('users').map(function(userId) {
        return r.table('users').get(userId).pluck(['username'])
      }) }

      //   r.db("bin_dev").table('bins').getAll(r.args(r.db('bin_dev').table('users').get("0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216")('bins'))).merge(function (bin) {
      //   return { users: bin('users').map(function(userId) {
      //     return r.db("bin_dev").table('users').get(userId).pluck(['username'])
      //   }) }
      // })
    }).run(this._rdbConn)
    var bins = yield cursor.toArray()
    console.log('got bins ', bins)
    this.type = 'application/json'
    this.body = JSON.stringify(bins)
  }
  catch(e) {
    this.status = 500
    this.body = e.message || http.STATUS_CODES[this.status]
  }
  
}

// Create a new bin  
module.exports.create = function *create(next) {
  var userId = this.query.userId || constUserId
  try{
    var bin = yield parse(this)
    // make userId dynamic
    if (!bin.slug) {
      throw "no slug"
    } else if (yield r.table('bins')('slug').contains(bin.slug).run(this._rdbConn)) {
      throw "duplicate slug"
    } 
    bin.title = bin.title || bin.slug
    bin.users = [userId]
    bin.createdAt = r.now().toEpochTime().mul(1000) // Set the field `createdAt` to the current time



    // Insert a new post
    var result = yield r.table('bins').insert(bin, {returnChanges: true}).run(this._rdbConn)

    bin = result.changes[0].new_val // post now contains the new post + a field `id` and `createdAt`
    this.type = 'application/json'
    this.body = JSON.stringify(bin)
  }
  catch(e) {
    this.status = 500
    this.body = e.message || http.STATUS_CODES[this.status]
  }
}