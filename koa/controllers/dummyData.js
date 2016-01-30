var r = require('rethinkdb')


// Create a few sample posts 

var binId =  'ed69b97c-cd29-4f70-9c0a-34d01dddf7ce'
var userId = '0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216'
var postId = '1e93b6ad-baa2-4f03-9c5d-4c5ea6c92299'


var user = {
  id: ['0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216'],
  username: "adhsu",
  password: 'beep',
  email: 'adhsu01@gmail.com',
  bins: [],
  createdAt: r.now().toEpochTime().mul(1000) 
}

var binObj = {}
binObj['ed69b97c-cd29-4f70-9c0a-34d01dddf7ce'] = r.now().toEpochTime().mul(1000) 
user.bins.push(binObj)

var bin = {
  id: 'ed69b97c-cd29-4f70-9c0a-34d01dddf7ce',
  slug: 'fell',
  title: "Fell St Bin",
  users: ['0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216'],
  posts: ['1e93b6ad-baa2-4f03-9c5d-4c5ea6c92299'],
  createdAt: r.now().toEpochTime().mul(1000) 
}

var post = {
  binId: 'ed69b97c-cd29-4f70-9c0a-34d01dddf7ce',
  binSlug: 'fell',
  title: "Trumpet Solo",
  url: "http://imgur.com/hziqUul.gif",
  createdAt: r.now().toEpochTime().mul(1000),
  mediaType: "gif",
  reactions: {
    "wink": ['0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216']
  }
}

module.exports.dummyData = function (next) {

  console.log('hi' + r)
  try{
    // var userResult = yield r.table('users').insert(user, {returnChanges: true}).run(this._rdbConn)
    // var binResult = yield r.table('bins').insert(bin, {returnChanges: true}).run(this._rdbConn)
    // var postResult = yield r.table('posts').insert(post, {returnChanges: true}).run(this._rdbConn)    
  } 
  catch(e){
    console.log('err!', e)
  }
}

