/*jshint node:true */
'use strict';

var _config = require('./../../config');

var _config2 = _interopRequireDefault(_config);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _thinky = require('./../utils/thinky.js');

var _bins = require('./../models/bins');

var _bins2 = _interopRequireDefault(_bins);

var _posts = require('./../models/posts');

var _posts2 = _interopRequireDefault(_posts);

var _users = require('./../models/users');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TwitterStrategy = require('passport-twitter').Strategy;

// var r = require('../db');

_passport2.default.serializeUser(function (user, done) {
  return done(null, user.id);
});

_passport2.default.deserializeUser(function (id, done) {
  _thinky.r.table('users').get(id).run(_thinky.r.conn).then(function (user) {
    done(null, user);
  });
});

var loginCallbackHandler = function loginCallbackHandler(objectMapper, type) {
  return function (accessToken, refreshToken, profile, done) {
    if (accessToken !== null) {

      _users2.default.get(profile.username).run().then(function (users) {
        return done(null, users[0]);
      }).catch(_thinky.Errors.DocumentNotFound, function (err) {
        var user = new _users2.default(objectMapper(profile));
        // ToDo: add default bin - or have that be a step after signing in?
        return user.save().then(function (response) {
          return _users2.default.get(response.generated_keys[0]).run();
        });
      }).then(function (newUser) {
        done(null, newUser);
      });
    }
  };
};
var callbackURL = 'http://' + _config2.default.url + ':' + _config2.default.ports.http + '/auth/login/callback';

// Twitter
_passport2.default.use(new TwitterStrategy({
  consumerKey: _config2.default.twitter.consumerKey,
  consumerSecret: _config2.default.twitter.consumerSecret,
  callbackURL: callbackURL + '/twitter'
}, loginCallbackHandler(function (profile) {
  return {
    'id': profile.username,
    'name': profile.displayName || null,
    'url': profile._raw.expanded_url || null,
    'avatarUrl': profile._json.profile_image_url,
    'type': 'twitter'
  };
}, 'twitter')));

_passport2.default.checkIfLoggedIn = function (req, res, next) {
  if (req.user) {
    return next();
  }
  return res.status(401).send('You\'re not logged in');
};

module.exports = _passport2.default;
//# sourceMappingURL=index.js.map