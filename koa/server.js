var koa = require('koa')
var router = require('koa-router')
var mount = require('koa-mount')
var app = koa()

var handler = function *(next){
  this.body = {'api-status': 'working'}
}

var API = new router()
API.get('/test', handler)


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