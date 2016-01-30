var thinky = require('./../utils/thinky.js')
var r = thinky.r
var type = thinky.type;

var User = thinky.createModel("User", {
  id: type.string(),
//   email: type.string().email(),
  name: type.string(),
  url: type.string(),
  avatarUrl: type.string(),
  type: type.string(),
  createdAt: type.date().default(r.now())
});

module.exports = User;

var Post = require('./posts')
var Bin = require('./bins')
// a user has many posts
User.hasMany(Post, "posts", "id", "authorId")
// a user has and belongs to many bins
User.hasAndBelongsToMany(Bin, "bins", "id", "id")

User.ensureIndex("createdAt");
User.ensureIndex("access_token");
