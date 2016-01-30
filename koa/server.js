var koa = require('koa')
var router = require('koa-router')
var mount = require('koa-mount')
var cors = require('koa-cors');
var fs = require('fs')

// Middleware and helpers 
var serve = require('koa-static')
var parse = require('co-body')
var http = require('http')

var r = require('rethinkdb')

var posts = require('./controllers/posts')
var bins = require('./controllers/bins')
var dummyData = require('./dummyData')
var config = require(__dirname+"/config.js")

var app = koa()
require('koa-qs')(app)

app.use(cors())

var MetaInspector = require('node-metainspector')

// Thank the Lord for http://zef.me/blog/6096/callback-free-harmonious-node-js


var getURL = function *(next){

  try {
    // var url = this.url.replace('/title/?url=','')
    var url = this.query.url    
    var client = new MetaInspector(url, { timeout: 5000 })

    // var fetch = thunkify(client.on('fetch'))
    var clientListener = function(){
      return function(callback) {
        client.on('fetch', callback)
        client.on('error', callback)
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
  catch (e) {
    console.log('error')
    this.status = 500
    this.body = e.message || http.STATUS_CODES[this.status]
  }
  
  
}

var createConnection = function *(next) {
  try{
    // open connection and wait for r.connect to resolve
    var connection = yield r.connect(config.rethinkdb)
    // Save connection in the current context
    this._rdbConn = connection
  }
  catch(e) {
    this.status = 500
    this.body = e.message || http.STATUS_CODES[this.status]
  }
  yield next 
}

var get = function *(next) {
  try{
    var cursor = yield r.table('todos').orderBy({index: "createdAt"}).run(this._rdbConn)
    var result = yield cursor.toArray()
    this.body = JSON.stringify(result)
  }
  catch(e) {
    this.status = 500
    this.body = e.message || http.STATUS_CODES[this.status]
  }
}

function* create(next) {
    try{
        // Parse the POST data
        var todo = yield parse(this)
        todo.createdAt = r.now() // Set the field `createdAt` to the current time

        // Insert a new Todo
        var result = yield r.table('todos').insert(todo, {returnChanges: true}).run(this._rdbConn)

        todo = result.new_val // todo now contains the previous todo + a field `id` and `createdAt`
        this.body = JSON.stringify(todo)
    }
    catch(e) {
        this.status = 500
        this.body = e.message || http.STATUS_CODES[this.status]
    }
    yield next
}

function* update(next) {
    try{
        var todo = yield parse(this)
        delete todo._saving
        if ((todo == null) || (todo.id == null)) {
            throw new Error("The todo must have a field `id`.")
        }

        var result = yield r.table('todos').get(todo.id).update(todo, {returnChanges: true}).run(this._rdbConn)
        this.body = JSON.stringify(result.changes[0].new_val)
    }
    catch(e) {
        this.status = 500
        this.body = e.message || http.STATUS_CODES[this.status]
    }
    yield next
}

function* del(next) {
    try{
        var todo = yield parse(this)
        if ((todo == null) || (todo.id == null)) {
            throw new Error("The todo must have a field `id`.")
        }
        var result = yield r.table('todos').get(todo.id).delete().run(this._rdbConn)
        this.body = ""
    }
    catch(e) {
        this.status = 500
        this.body = e.message || http.STATUS_CODES[this.status]
    }
    yield next
}

r.connect(config.rethinkdb, function(err, conn) {
    if (err) {
        console.log("Could not open a connection to initialize the database")
        console.log(err.message)
        process.exit(1)
    }

    r.table('users').indexWait('createdAt').run(conn).then(function(err, result) {
        console.log("User table ready, checking post table...")

        // insert dummy data if 0 rows
        r.table('users').count().run(conn).then(function(result) {
            console.log('num users existing: ', result)
            if (result==0) {
                console.log('0 users, adding dummy data...')
                r.table('users').insert(dummyData.users).run(conn)
            }
        })

    }).error(function(err) {
        // The database/table/index was not available, create them
        r.dbCreate(config.rethinkdb.db).run(conn).finally(function() {
            return r.tableCreate('users').run(conn)
        }).finally(function() {
            r.table('users').indexCreate('createdAt').run(conn)
        }).finally(function(result) {
            r.table('users').indexWait('createdAt').run(conn)
        }).then(function(result) {
            console.log("User table and index created, checking post table...")
            // conn.close()
        }).error(function(err) {
            if (err) {
                console.log("Could not wait for the completion of the index `users`")
                console.log(err)
                process.exit(1)
            }
            console.log("Table and index are available, checking post table...")
            // conn.close()
        })
    })

    r.table('posts').indexWait('binSlug_createdAt').run(conn).then(function(err, result) {
        console.log("posts table ready, checking bin table...")

        // insert dummy data if 0 rows
        r.table('posts').count().run(conn).then(function(result) {
            console.log('num posts existing: ', result)
            if (result==0) {
                console.log('0 posts, adding dummy data...')
                r.table('posts').insert(dummyData.posts).run(conn)
            }
        })

    }).error(function(err) {
        // The database/table/index was not available, create them
        r.tableCreate('posts').run(conn).finally(function() {
            r.table('posts').indexCreate('binSlug_createdAt', [r.row('binSlug'), r.row('createdAt')]).run(conn)
        }).finally(function(result) {
            r.table('posts').indexWait('binSlug_createdAt').run(conn)
        }).then(function(result) {
            console.log("post table and index created, checking bin table...")
            // conn.close()
        }).error(function(err) {
            if (err) {
                console.log("Could not wait for the completion of the index `posts`")
                console.log(err)
                process.exit(1)
            }
            console.log("Table and index are available, checking bin table...")
            // conn.close()
        })
    })

    r.table('bins').indexWait('createdAt').run(conn).then(function(err, result) {
        console.log("bins table ready")

        // insert dummy data if 0 rows
        r.table('bins').count().run(conn).then(function(result) {
            console.log('num bins existing: ', result)
            if (result==0) {
                console.log('0 bins, adding dummy data...')
                r.table('bins').insert(dummyData.bins).run(conn)
            }
        })

        startKoa()
    }).error(function(err) {
        // The database/table/index was not available, create them
        r.tableCreate('bins').run(conn).finally(function() {
            r.table('bins').indexCreate('slug').run(conn)
        }).finally(function(result) {
            r.table('bins').indexWait('slug').run(conn)
        }).then(function(result) {
            console.log("bin table ready...")
            startKoa()
            conn.close()
        }).error(function(err) {
            if (err) {
                console.log("Could not wait for the completion of the index `bins`")
                console.log(err)
                process.exit(1)
            }
            console.log("Table and index are available, checking bin table...")
            startKoa()
            conn.close()
        })
    })
})

function* closeConnection(next) {
    this._rdbConn.close()
}




var API = new Router()
API.get('/title/', getURL)
API.get('/posts/get', posts.all)
API.put('/posts/create', posts.create)
API.del('/posts/delete', posts.delete)
API.post('/posts/toggleReaction', posts.toggleReaction)
// API.post('/todo/delete', del)

API.get('/bins/get', bins.getBins)
API.put('/bins/create', bins.create)

app.use(createConnection)

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

function startKoa() {
    app.listen(config.koa.port)
    console.log('Listening on port '+config.koa.port)
}