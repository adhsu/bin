'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createPost = createPost;
exports.deletePost = deletePost;
exports.fetchPosts = fetchPosts;

var _thinky = require('./../utils/thinky.js');

var Bin = require('./../models/bins');
var Post = require('./../models/posts');
var User = require('./../models/users');

// createPost
// POST /api/posts
// query params {auth_token}
// body {binId, url, title, mediaType}
// => {post}
function createPost(req, res) {
  //security assumption: bin exists and user is in that bin
  var binId = req.body.binId;
  var postBody = req.body;
  postBody.authorId = req.token.id;
  postBody.reactions = [];

  var post = new Post(postBody);
  post.save().then(function (result) {
    res.json(result);
  });
}

// deletePost
// DELETE /api/posts/:id
// query params {auth_token}
// => {ok:true}
function deletePost(req, res) {
  // check if currentUser is the author of post
  var currentUserId = req.token.id;
  var postId = req.params.postId;

  Post.get(postId).run().then(function (post) {
    if (post.authorId == currentUserId) {
      post.delete().then(function (result) {
        return res.json({ ok: true });
      });
    } else {
      return res.json({
        ok: false,
        message: 'you are not the author of this post'
      });
    }
  });
}

// fetchPosts
// GET /api/posts
// query params {binId, /lastViewed, offset, limit/, token}
// => bin passed: [{post}]

function fetchPosts(req, res) {
  var binId = req.query.binId;
  var lastViewed = +req.query.lastViewed || Date.now();
  var offset = +req.query.offset || 0;
  var limit = +req.query.limit || 3;

  Post.between([binId, _thinky.r.minval], [binId, _thinky.r.maxval], { index: "binId_createdAt" }).orderBy({ index: _thinky.r.desc('binId_createdAt') }).getJoin({ reactions: true }).filter(function (post) {
    return post("createdAt").lt(lastViewed);
  }).skip(offset).limit(limit).run().then(function (posts) {

    // Go through every post object and flatten the reactions array

    posts = posts.map(function (post) {

      var reactions = {};
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = post.reactions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var reaction = _step.value;

          // iterate through all reactions within a specific post
          if (reactions.hasOwnProperty(reaction.emojiId)) {
            reactions[reaction.emojiId]++;
          } else {
            reactions[reaction.emojiId] = 1;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      post.reactions = reactions;
      return post;
    });
    res.json(posts);
  });

  // Bin.get(binId).getJoin().run().then(function(bin){
  //   res.json(bin.posts)
  // }).catch(Errors.DocumentNotFound, function(err) {
  //   res.json({err: 'Bin does not exist.'})
  // })
}
//# sourceMappingURL=posts.js.map