import thinky from'./../utils/thinky.js'
var type = thinky.type
var Errors = thinky.Errors

var Bin = require('./../models/bins')

module.exports = function(req, res, next) {

  var currentUserId = req.token.id
  var currentBin = req.body.binId || req.query.binId || req.params.binId

  Bin.get(currentBin).getJoin({users: true}).run().then(function(bin){
    const users = bin.users 
    for(var i = 0; i < users.length; i++) {
        if (users[i].id == currentUserId) {
            next()
            return ' '
        }
    }
    return res.json({"err": "User is not in that Bin."})
  }).catch(Errors.DocumentNotFound, function(err) {
    return res.json({"err": "Bin not found."})
  })

};