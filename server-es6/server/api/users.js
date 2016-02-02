import thinky from './../utils/thinky'
var r = thinky.r
var type = thinky.type


var Bin = require('./../models/bins')
var Post = require('./../models/posts')
var User = require('./../models/users')

// fetchAuthedUser
// GET /api/me
// query params {auth_token}
// => {userObj}
export function fetchAuthedUser(req, res) {
  
  const userId = req.token.id
  
  User.get(userId).run().then(function(user){
    res.json(user)
  })

}