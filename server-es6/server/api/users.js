import {r, type, Errors} from'./../utils/thinky.js'

var Bin = require('./../models/bins')
var Post = require('./../models/posts')
var User = require('./../models/users')


// fetchAuthedUser
// GET /api/me
// query params {auth_token}
// => {userObj}
export function fetchAuthedUser(req, res) {
  
  const userId = req.token.id
  
  User.get(userId).getJoin({bins: {users: {avatarUrl: true, id: true, name: true}}}).run().then(function(user){
    res.json(user)
  })
}
