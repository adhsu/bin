var koa = require('koa')
var router = require('koa-router')
var mount = require('koa-mount')
var cors = require('koa-cors');

// Middleware and helpers 
var serve = require('koa-static')
var parse = require('co-body')
var http = require('http')

var api = require('./controllers/api')
var config = require("./config-thinky")

var app = koa()
require('koa-qs')(app)

app.use(cors())

app.use(function *(next) {
  try {
    yield next;
  } catch (err) {
    console.log('***ERROR*** : ', err)
    this.status = err.status || 500;
    this.body = err.message;
    this.app.emit('error', err, this);
  }
})

var API = new router()
API.get('/resetAndCreateSampleData', api.resetAndCreateSampleData)
API.put('/bincreate', api.createBin)
API.get('/bins', api.bins)

app.use(mount('/api', API.middleware()))

function startKoa() {
    app.listen(config.koa.port)
    console.log('Listening on port '+config.koa.port)
}

startKoa()