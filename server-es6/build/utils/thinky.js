"use strict";

var _config = require("./../../config");

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var thinky = require('thinky')({
  host: _config2.default.rethinkdb.host,
  port: _config2.default.rethinkdb.port,
  db: _config2.default.rethinkdb.db
});

module.exports = thinky;
//# sourceMappingURL=thinky.js.map