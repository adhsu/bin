var config = require("./../config-thinky")
var thinky = require('thinky')({
  host: config.rethinkdb.host,
  port: config.rethinkdb.port,
  db: config.rethinkdb.db
})

module.exports = thinky;