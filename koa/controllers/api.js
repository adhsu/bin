var parse = require('co-body')
var thinky = require('./../utils/thinky.js')
var r = thinky.r
var type = thinky.type;

var constUserId = "0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216"
var dummyData = require('./../dummyData')
var Bin = require('./../models/bins')
var Post = require('./../models/posts')
var User = require('./../models/users')

exports.resetAndCreateSampleData = function *(next) {
  yield Bin.delete()
  yield Post.delete()
  yield User.delete()
  console.log('all deleted!')
  
  var bin = new Bin(dummyData.bins[0])
  var user = new User(dummyData.users[0])
  var post1 = new Post(dummyData.posts[0])

  // join everything up
  post1.author = user
  post1.bin = bin

  // user.bins = [bin]
  // bin.users = [user]

  // user.posts = [post1]
  // bin.posts = [post1]

  // save things
  // user.save()
  // bin.save()
  // post1.save()

  this.body = 'all done!'
}

exports.createBin = function *(next) {
  var bin = yield parse(this)
  
  if (!bin.slug) {
    throw "no slug"
  } else if (yield Bin('slug').contains(bin.slug)) {
    throw "duplicate slug"
  } 

  bin.title = bin.title || bin.slug
  bin.users = [bin.userId]
  bin.createdAt = r.now().toEpochTime().mul(1000) // Set the field `createdAt` to the current time

  var newBin = {
    slug: bin.slug,
    title: bin.title
  }
  console.log('newbin is ', newBin)
  var result = yield newBin.save()

  console.log('saved ', result, result.isSaved())
  
  this.type = 'application/json'
  this.body = JSON.stringify(bin)

}

exports.bins = function *(next) {
  var userId = this.query.userId || constUserId
  var bins = yield Bin.getJoin({posts: true})

  console.log('got bins ', bins)
  this.type = 'application/json'
  this.body = JSON.stringify(bins)
  // this.body = bins

}
