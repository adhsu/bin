var thinky = require('./../utils/thinky.js')
var r = thinky.r
var type = thinky.type

var Post = thinky.createModel("Post", {
  id: type.string(),
  title: type.string(),
  url: type.string(),
  mediaType: type.string(),
  reactions: [{
    id: type.string(),
    users: [type.string()]
  }],
  createdAt: type.date().default(r.now()),
  authorId: type.string(),
  binId: type.string()
})

module.exports = Post;

var User = require('./users')
var Bin = require('./bins')
var Reaction = require('./reactions')
// a post belongs to a user
Post.belongsTo(User, "author", "authorId", "id")
// a post belongs to a bin
Post.belongsTo(Bin, "bin", "binId", "id")
// a post has many reactions
Post.hasMany(Reaction, "reactions", "id", "postId")

Post.ensureIndex("createdAt");
Post.ensureIndex("binId_createdAt", function(doc) {
  return doc("binId").add(doc("createdAt"))
})