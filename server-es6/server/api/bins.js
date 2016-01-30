import resource from 'resource-router-middleware';
import {r, type, Errors} from'./../utils/thinky.js'

var Bin = require('./../models/bins')
var Post = require('./../models/posts')
var User = require('./../models/users')

export function createBin(req, res) {

  let bin = new Bin({
    id: 'fell',
    title: 'Fell St Bin',
    invite_code: 'fell'
  })
  bin.save().then(function(result){
    console.log(result)
    res.send(result)
  })
}

export function joinBin(req, res) {

  const binId = 'fell'
  const invite_code = 'fell'
  const user = req.user
  console.log(user)

  // Find Bin, see that it exists, match invite_code, add user to bin 

  Bin.get(binId).run().then(function(bin){
    console.log(bin)
    // bin exists 
    if (bin.invite_code == invite_code) {
      //invite_code matches 
      bin.users.push(user)
      bin.saveAll({users: true}).then((result) => {
        res.send(bin)
      })
    }
    
  }).catch(Errors.DocumentNotFound, function(err) {
    res.json({err: 'Bin does not exist.'})
  })
}