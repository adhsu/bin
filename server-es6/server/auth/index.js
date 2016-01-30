/*jshint node:true */
'use strict';

import config from "./../../config"
import passport from 'passport'
var TwitterStrategy = require('passport-twitter').Strategy;

import {r, type, Errors} from'./../utils/thinky.js'

import Bin from './../models/bins'
import Post from './../models/posts'
import User from './../models/users'

// var r = require('../db');

passport.serializeUser(function (user, done) {
  return done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  r
    .table('users')
    .get(id)
    .run(r.conn)
    .then(function (user) {
      done(null, user);
    });
});

var loginCallbackHandler = function (objectMapper, type) {
  return function (accessToken, refreshToken, profile, done) {
    if (accessToken !== null) {
      console.log('logged in')
      console.log(objectMapper(profile))

      User.get(profile.username).run().then(function(users){
        console.log(users)
        return done(null, users[0]);

        
      }).catch(Errors.DocumentNotFound, function(err) {
        let user = new User(objectMapper(profile))
        // ToDo: add default bin
        return user.save().then(function(response) {
            return User.get(response.generated_keys[0]).run()
          })
      }).then(function (newUser) {
        done(null, newUser)
      })
        // r.table('users')
        //   .insert(objectMapper(profile))
        //   .run(r.conn)
        //   .then(function (response) {
        //     return r.table('users')
        //       .get(response.generated_keys[0])
        //       .run(r.conn);
        //   })
        //   .then(function (newUser) {
        //     done(null, newUser);
        //   })
      // r
      //   .table('users')
      //   .getAll(profile.username, { index: 'login' })
      //   .filter({ type: type })
      //   .run(r.conn)
      //   .then(function (cursor) {
      //     return cursor.toArray()
      //       .then(function (users) {
      //         if (users.length > 0) {
      //           return done(null, users[0]);
      //         }
      //         return r.table('users')
      //           .insert(objectMapper(profile))
      //           .run(r.conn)
      //           .then(function (response) {
      //             return r.table('users')
      //               .get(response.generated_keys[0])
      //               .run(r.conn);
      //           })
      //           .then(function (newUser) {
      //             done(null, newUser);
      //           });
      //       });
      //   })
      //   .catch(function (err) {
      //     console.log('Error Getting User', err);
      //   });
    }
  };
};
var callbackURL = 'http://' + config.url + ':' + config.ports.http + '/auth/login/callback';


// Twitter
passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: callbackURL + '/twitter'
  },
  loginCallbackHandler(function (profile) {
    return {
      'id': profile.username,
      'name': profile.displayName || null,
      'url': profile._raw.expanded_url || null,
      'avatarUrl': profile._json.profile_image_url,
      'type': 'twitter'
    };
  }, 'twitter')
));

passport.checkIfLoggedIn = function (req, res, next) {
  if (req.user) {
    return next();
  }
  return res.status(401).send('You\'re not logged in');
};

module.exports = passport;
