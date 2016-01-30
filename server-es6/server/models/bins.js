var thinky = require('./../utils/thinky.js')
var r = thinky.r
var type = thinky.type;

var Bin = thinky.createModel("Bin", {
  id: type.string(),
  title: type.string(),
  createdAt: type.date().default(r.now())
})

module.exports = Bin;

var User = require('./users')
var Post = require('./posts')
// a bin has many posts
Bin.hasMany(Post, "posts", "id", "binId")
// a bin has and belongs to many users
Bin.hasAndBelongsToMany(User, "users", "id", "id")

