import {r, type, Errors} from'./../utils/thinky.js'

var Bin = require('./../models/bins')
var Post = require('./../models/posts')
var User = require('./../models/users')
var Reaction = require('./../models/reactions')


// addReaction - idempotent!
// PUT /api/reactions/:binId/:postId/:emojiId
// query params {auth_token}
// => {ok: true}
export function addReaction(req, res) {

  //security assumption: bin exists and user is in that bin

  const reaction_id = req.token.id + '_' + req.params.postId + '_' + req.params.emojiId

  Reaction.get(reaction_id).run().then(function(reaction){
    res.json({ok: true})
  }).catch(Errors.DocumentNotFound, function(err) {
    
    const reactionObj = {
      userId: req.token.id,
      postId: req.params.postId,
      emojiId: req.params.emojiId,
      id: reaction_id
    }

    const reaction = new Reaction(reactionObj)

    reaction.save().then(function(result){
      res.json({ok: true})
    })
  })
}

// deleteReaction
// DELETE /api/reactions/:binid/:postId/:emojiId
// query params {auth_token}
// => {ok: true}
export function deleteReaction(req, res) {
  // make sure user owns reaction implicitly with auth_token userId
  const reaction_id = req.token.id + '_' + req.params.postId + '_' + req.params.emojiId

  Reaction.get(reaction_id).run().then(function(reaction){
    reaction.delete().then(function(result){
      return res.json({ok: true})
    })
  }).catch(Errors.DocumentNotFound, function(err) {
    
    res.json({"err": "Reaction does not exist."})
  })
}

// fetchReactions
// GET /reactions
// query params {auth_token}
// => array of reaction objects [ {id, postId, emojiId, createdAt} ]
export function fetchReactions(req, res) {
  const userId = req.token.id
  Reaction.getAll(userId, {index: 'userId'}).run().then(function(reactions) {
    res.json(reactions)
  }).catch(Errors.DocumentNotFound, function(err){
    res.send('none found')
  })
}

