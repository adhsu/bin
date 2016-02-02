import resource from 'resource-router-middleware';
import {r, type, Errors} from'./../utils/thinky.js'

var Bin = require('./../models/bins')
var Post = require('./../models/posts')
var User = require('./../models/users')



export function createBin(req, res) {

  const binId = req.params.binId
  const userId = req.query.userId

  Bin.get(binId).getJoin({users: true}).run().then(function(bin){
    res.json({err: 'Bin already exists'})
  }).catch(Errors.DocumentNotFound, function(err) {
    
    let bin = new Bin({
      id: binId,
      title: 'Change the title fool!',
      invite_code: 'random'
    })

    

    User.get(userId).run().then(function(user){
      bin.users = [user]
      bin.saveAll({users: true}).then((result) => {
        res.send(bin)
      })
    }) 
  })
}


// joinBin
// POST /api/bins/:id/join
// query params {token, userId}
// body {invite_code}
// => {ok: true}
export function joinBin(req, res) {

  const invite_code = req.body.invite_code
  const binId = req.params.binId
  const userId = req.token.id
  // Find Bin, see that it exists, match invite_code, add user to bin 

  Bin.get(binId).getJoin({users: true}).run().then(function(bin){
    // bin exists 
    if (bin.invite_code == invite_code) {
      //invite_code matches 
      User.get(userId).run().then(function(user){
        bin.users.push(user)
        bin.saveAll({users: true}).then((result) => {
          res.send(bin)
        })
      }) 
    }
    
  }).catch(Errors.DocumentNotFound, function(err) {
    res.json({err: 'Bin does not exist.'})
  })
}

// fetchUserBins
// GET /api/bins
// query params {auth_token}
// => {bins}
export function fetchUserBins(req, res) {
  const userId = req.token.id 
  User.get(userId).getJoin({bins: true}).run().then(function(user){
    res.json(user.bins)
  })
}

