var koa = require('koa')
var router = require('koa-router')
var mount = require('koa-mount')
var thunkify = require('thunkify')
var app = koa()




var MetaInspector = require('node-metainspector');

// Thank the Lord for http://zef.me/blog/6096/callback-free-harmonious-node-js

var getURL = function *(next){

  var url = this.url.replace('/title/?url=','')

  var client = new MetaInspector(url, { timeout: 5000 });

  // var fetch = thunkify(client.on('fetch'))

  var clientListener = function(){
    return function(callback) {
      client.on('fetch', callback)
    }
  }

  client.fetch()

  yield clientListener()
  // try {
  //   throw "file too large"
  // }
  // catch (e) {
  //   console.log(e)
  //   this.body = 'File too large'
  // }


  this.body = {'title': client.title, 'ogTitle': client.ogTitle, 'host': client.host, 'image': client.image}
  // console.log(client)



  
}


var API = new router()
API.get('/title/', getURL)

// // x-response-time

// app.use(function *(next){
//   var start = new Date
//   yield next
//   var ms = new Date - start
//   this.set('X-Response-Time', ms + 'ms')
// })

// // logger

// app.use(function *(next){
//   var start = new Date
//   yield next
//   var ms = new Date - start
//   console.log('%s %s - %s', this.method, this.url, ms)
// })

// // response

// app.use(function *(){
//   this.body = 'Hello World'
// })

app.use(mount('/api', API.middleware()))

app.listen(3000)