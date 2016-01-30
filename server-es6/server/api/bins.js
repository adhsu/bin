import resource from 'resource-router-middleware';

var thinky = require('./../utils/thinky.js')
var r = thinky.r
var type = thinky.type


var Bin = require('./../models/bins')
var Post = require('./../models/posts')
var User = require('./../models/users')

export let createBin = function(req, res) {
  let bin = new Bin({
    id: 'fell',
    title: 'Fell St Bin'
  })
  bin.save().then(function(result){
    console.log(result)
    res.send(result)
  })
}