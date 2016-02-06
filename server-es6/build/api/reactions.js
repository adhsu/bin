'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addReaction = addReaction;
exports.deleteReaction = deleteReaction;
exports.fetchReactions = fetchReactions;

var _thinky = require('./../utils/thinky.js');

var Bin = require('./../models/bins');
var Post = require('./../models/posts');
var User = require('./../models/users');
var Reaction = require('./../models/reactions');

// addReaction - idempotent!
// PUT /api/reactions/:binId/:postId/:emojiId
// query params {auth_token}
// => {ok: true}
function addReaction(req, res) {

  //security assumption: bin exists and user is in that bin

  var reaction_id = req.token.id + '_' + req.params.postId + '_' + req.params.emojiId;

  Reaction.get(reaction_id).run().then(function (reaction) {
    res.json({ ok: true });
  }).catch(_thinky.Errors.DocumentNotFound, function (err) {

    var reactionObj = {
      userId: req.token.id,
      postId: req.params.postId,
      emojiId: req.params.emojiId,
      id: reaction_id
    };

    var reaction = new Reaction(reactionObj);

    reaction.save().then(function (result) {
      res.json({ ok: true });
    });
  });
}

// deleteReaction
// DELETE /api/reactions/:binid/:postId/:emojiId
// query params {auth_token}
// => {ok: true}
function deleteReaction(req, res) {
  // make sure user owns reaction implicitly with auth_token userId
  var reaction_id = req.token.id + '_' + req.params.postId + '_' + req.params.emojiId;

  Reaction.get(reaction_id).run().then(function (reaction) {
    reaction.delete().then(function (result) {
      return res.json({ ok: true });
    });
  }).catch(_thinky.Errors.DocumentNotFound, function (err) {

    res.json({ "err": "Reaction does not exist." });
  });
}

// fetchReactions
// GET /reactions
// query params {auth_token}
// => array of reaction objects [ {id, postId, emojiId, createdAt} ]
function fetchReactions(req, res) {
  var userId = req.token.id;
  Reaction.getAll(userId, { index: 'userId' }).run().then(function (reactions) {
    res.json(reactions);
  }).catch(_thinky.Errors.DocumentNotFound, function (err) {
    res.send('none found');
  });
}
//# sourceMappingURL=reactions.js.map