import resource from 'resource-router-middleware';

var thinky = require('./../utils/thinky.js')
var r = thinky.r
var type = thinky.type


var Bin = require('./../models/bins')
var Post = require('./../models/posts')
var User = require('./../models/users')

export let createUser = function(req, res) {
  let user = new User({
    id: "adhsu",
    email: "adhsu@gmail.com"
  })

  Bin.get("fell").run().then(function(bin){
    user.bins = [bin]
    user.saveAll({bins: true}).then(function(result){
      User.getJoin("")
      res.send(result)
    })
  })


  
}