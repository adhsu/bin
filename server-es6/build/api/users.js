'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAuthedUser = fetchAuthedUser;

var _thinky = require('./../utils/thinky.js');

var Bin = require('./../models/bins');
var Post = require('./../models/posts');
var User = require('./../models/users');

// fetchAuthedUser
// GET /api/me
// query params {auth_token}
// => {userObj}
function fetchAuthedUser(req, res) {

  var userId = req.token.id;

  User.get(userId).getJoin({ bins: { users: { avatarUrl: true, id: true, name: true } } }).run().then(function (user) {
    res.json(user);
  });
}
//# sourceMappingURL=users.js.map