import express from 'express'
import bodyParser from 'body-parser'
import r from 'rethinkdb'
import config from './../config'

const app = express()
app.use(express.static('./public'))
app.use(bodyParser())

// connect to db
app.use(createConnection)

// define main routes
app.route('/posts/get').get(getPosts);

// middleware to close db conn
app.use(closeConnection);

// get all posts
const getPosts = (req, res, next) => {
  r.table('posts').orderBy({index: r.desc('timestamp')}).run(req._rdbConn)
  .then(cursor => {
    return cursor.toArray()
  })
  .then(result => {
    res.send(JSON.stringify(result))
  })
  .error(handleError(res))
  .finally(next)
}


/*
 * Send back a 500 error
 */
const handleError = (res) => {
    return (error) => {
        res.send(500, {error: error.message});
    }
}

/*
 * Create a RethinkDB connection, and save it in req._rdbConn
 */
const createConnection = (req, res, next) => {
    r.connect(config.rethinkdb).then((conn) => {
        req._rdbConn = conn;
        next();
    }).error(handleError(res));
}

/*
 * Close the RethinkDB connection
 */
const closeConnection = (req, res, next) => {
    req._rdbConn.close();
}

/*
 * Create tables/indexes then start express
 */
r.connect(config.rethinkdb, function(err, conn) {
    if (err) {
        console.log("Could not open a connection to initialize the database");
        console.log(err.message);
        process.exit(1);
    }

    r.table('posts').indexWait('createdAt').run(conn).then(function(err, result) {
        console.log("Table and index are available, starting express...");
        startExpress();
    }).error(function(err) {
        console.log(err)
        conn.close()
    });
});

function startExpress() {
    app.listen(config.express.port);
    console.log('Listening on port '+config.express.port);
}