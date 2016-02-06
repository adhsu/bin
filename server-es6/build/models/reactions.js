'use strict';

var thinky = require('./../utils/thinky.js');
var r = thinky.r;
var type = thinky.type;

var Reaction = thinky.createModel("Reaction", {
  id: type.string(),
  userId: type.string(),
  postId: type.string(),
  emojiId: type.string(),
  createdAt: type.date().default(r.now().toEpochTime().mul(1000))
});

module.exports = Reaction;

var User = require('./users');
var Post = require('./posts');

//a reaction belongs to a user
Reaction.belongsTo(User, "author", "userId", "id");
// a reaction also belongs to a post
Reaction.belongsTo(Post, "post", "postId", "id");

Reaction.ensureIndex("userId");
//# sourceMappingURL=reactions.js.map