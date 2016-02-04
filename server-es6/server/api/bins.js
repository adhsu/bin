import {r, type, Errors} from './../utils/thinky.js'
import {nouns, adjectives} from '../utils/words'
var Bin = require('./../models/bins')
var Post = require('./../models/posts')
var User = require('./../models/users')


function generateInviteCode() {
  const adj = adjectives[Math.floor(Math.random()*adjectives.length)]
  const noun = nouns[Math.floor(Math.random()*nouns.length)]
  const invite_code = `${adj}-${noun}`
  console.log('generating invite code', invite_code)
  return invite_code
}

// createBin
// POST /api/bins/:id
// query params {token}
// => bin
export function createBin(req, res) {
  const binId = req.params.id
  const userId = req.token.id

  Bin.get(binId).getJoin({users: true}).run().then(function(bin){
    res.json({err: 'Bin already exists'})
  }).catch(Errors.DocumentNotFound, function(err) {
    
    let bin = new Bin({
      id: binId,
      title: 'Click here to set the title...',
      invite_code: generateInviteCode()
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
// query params {token}
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
          res.send({
            ok: true,
            bin
          })
        })
      }) 
    } else {
      res.send({
        ok: false,
        message: `Ah ah ah, you didn't say the magic word!`
      })
    }
    
  }).catch(Errors.DocumentNotFound, function(err) {
    res.json({err: 'Bin does not exist.'})
  })
}

// editBinTitle
// POST /api/bins/:id/title
// query params {token}
// body {title}
// => {ok: true}
export function editBinTitle(req, res) {
  const binId = req.params.id
  const userId = req.token.id
  const title = req.body.title
  Bin.get(binId).update({title}).run().then(function(bin) {
    res.json({
      ok: true,
      bin
    })
  })
}

// fetchUserBins
// GET /api/bins
// query params {auth_token}
// => {bins}
export function fetchUserBins(req, res) {
  const userId = req.token.id 

  User.get(userId).getJoin({bins: {users: {avatarUrl: true, id: true, name: true}}}).run().then(function(user){
    res.json(user.bins)
  })
}

// GET /api/bins/:id
// query params {token}
// => {ok: true}
export function fetchBin(req, res) {
  const binId = req.params.id

  Bin.get(binId).run().then(function(bin){
    // bin exists 
    res.send({ok: true, exists: true})
  }).catch(Errors.DocumentNotFound, function(err) {
    res.json({
      ok: false,
      exists: false,
      err: 'Bin does not exist.'
    })
  })
}
