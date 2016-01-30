import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import db from './db';
import middleware from './middleware';
import api from './api';
import session from 'express-session'
import config from "./../config"
import {ensureLoggedIn} from 'connect-ensure-login'
const authRequired = ensureLoggedIn('/noAuth')
import {r, type, Errors} from'./utils/thinky.js'

import * as binCtrl from './api/bins'
// import auth from './auth'
// import authRouter from './auth/auth-router'


import tokenAuth from './utils/tokenAuth'
import isAuthorized from './policies/isAuthorized'
import isCurrentUser from './policies/isCurrentUser'

import passport from 'passport'
import {Strategy as TwitterStrategy} from 'passport-twitter'
import {Strategy as JwtStrategy} from 'passport-jwt'
var jwtOpts = {}
jwtOpts.secretOrKey = 'secret';
jwtOpts.issuer = "accounts.bin.io";
jwtOpts.audience = "bin.io";


const callbackURL = 'http://' + config.url + ':' + config.ports.http + '/auth/login/callback';

import Bin from './models/bins'
import Post from './models/posts'
import User from './models/users'



passport.use(new JwtStrategy(jwtOpts, function(jwt_payload, done) {

	User.get(jwt_payload.sub).run().then(function(users){
	  console.log(users)
	  return done(null, users[0])
	}).catch(Errors.DocumentNotFound, function(err) {
	  return done(null, false)
	})

}));

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: callbackURL + '/twitter'
  },
  function(token, tokenSecret, profile, done) {
  	let objectMapper = function (profile) {
	    return {
	      'id': profile.username,
	      'name': profile.displayName || null,
	      'url': profile._raw.expanded_url || null,
	      'avatarUrl': profile._json.profile_image_url,
	      'type': 'twitter'
	    };
	  }
    // In this example, the user's Twitter profile is supplied as the user
    // record.  In a production-quality application, the Twitter profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    User.get(profile.username).run().then(function(user){
    	// We already have a user with this strategy, pass down the access_token we already have for them
      // let user = users[0]
      user.token = tokenAuth.issue({id: user.id})
      return done(null, user);
      
    }).catch(Errors.DocumentNotFound, function(err) {
    	// First time for user, create them and pass down the generated access_token
      let user = new User(objectMapper(profile))
      // ToDo: add default bin
      user.save().then(function(newUser) {
      	newUser.token = tokenAuth.issue({id: newUser.id})
      	done(null, newUser)
        // User.get(response.id).run().then(function(newUser){
        // 	newUser.token = tokenAuth.issue({id: newUser.id})
        // 	done(null, newUser)
        // })
      })
    })
    // .then(function (newUser) {
    // 	console.log(newUser)
    //   newUser.token = tokenAuth.issue({id: newUser.id})
    //   done(null, newUser)
    // })

    // return cb(null, profile);
  }
))

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});



var app = express();
app.server = http.createServer(app);

app.use(require('cookie-parser')());

// 3rd party middleware
app.use(cors({
	exposedHeaders: ['Link']
}));

app.use(bodyParser.json({
	limit : '100kb'
}));

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());


app.get('/',
  function(req, res) {
    res.send(req.user);
	});

app.get('/auth/login/twitter', passport.authenticate('twitter', {session: false}));

app.get('/auth/login/callback/twitter', 
  passport.authenticate('twitter', {failureRedirect: '/'}),
  	function(req, res) {
      // res.sendFile(__dirname + '/html/callback.html')
      res.redirect('http://127.0.0.1:3333/login?foo=bar&access_token='+req.user.token)
  		// res.send("/user?access_token=" + req.user.token)
  	}
  );

let evens = [0,2,4,6]
let odds = evens.map(v => v + 1);

app.get('/', function (req, res) {
	console.log(req)
  res.send(req.user);
});

app.get('/user', 
	isAuthorized,
	isCurrentUser,
	function(req, res) {
	  res.send(req.user)
	})

app.get('/bins/:binId/join', 
	isAuthorized,
	isCurrentUser,
	binCtrl.joinBin)

app.get('/createBin', 
	isAuthorized,
	isCurrentUser,
	binCtrl.createBin)
// app.get('/user', 
// 	passport.authenticate('jwt', { session: false},
// 	function(req, res) {
// 	  res.send(req.user)
// 	}))

app.get('/noAuth', function(req,res) {
	res.json({loginStatus: false})
})

app.get('/auth/logout/twitter', function(req, res) {
	req.logout()
	res.redirect("/noAuth")
})



// connect to db
db( λ => {

	// internal middleware
	app.use(middleware());

	// api router
	app.use('/api', api());

	app.server.listen(process.env.PORT || 3000);

	console.log(`Started on port ${app.server.address().port}`);
});

export default app;
