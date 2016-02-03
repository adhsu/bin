import http from 'http'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import middleware from './middleware'
import api from './api'
import session from 'express-session'
import config from "./../config"
import {r, type, Errors} from'./utils/thinky'
import {grabTitle} from './utils/scraper'



import * as binCtrl from './api/bins'
import * as postCtrl from './api/posts'
import * as userCtrl from './api/users'
import * as reactionCtrl from './api/reactions'



import tokenAuth from './utils/tokenAuth'
import isAuthorized from './policies/isAuthorized'
import isCurrentUser from './policies/isCurrentUser'
import isInBin from './policies/isInBin'

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
    User.get(profile.username).run().then(function(user){

      user.token = tokenAuth.issue({id: user.id})
      return done(null, user);
      
    }).catch(Errors.DocumentNotFound, function(err) {

      let user = new User(objectMapper(profile))

      user.save().then(function(newUser) {
      	newUser.token = tokenAuth.issue({id: newUser.id})
      	done(null, newUser)

      })
    })

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

app.use(passport.initialize())
app.use(passport.session())


app.get('/',
  function(req, res) {
    res.send(req.user);
	});

app.get('/auth/login/twitter', passport.authenticate('twitter', {session: false}))

app.get('/auth/login/callback/twitter', 
  passport.authenticate('twitter', {failureRedirect: '/'}),
  	function(req, res) {
      res.redirect('http://127.0.0.1:3333/login?foo=bar&access_token='+req.user.token)
  		// res.send("/user?access_token=" + req.user.token)
  	}
  )


app.get('/', function (req, res) {
	console.log(req)
  res.send(req.user);
});

app.post("/title", grabTitle)

app.get('/user', 
	isAuthorized,
	function(req, res) {
	  res.send(req.user)
	})

app.post('/bins/:binId/join', 
	isAuthorized,
	binCtrl.joinBin)

app.get('/createBin/:binId', 
	isAuthorized,
	binCtrl.createBin)

app.get('/bins', 
	isAuthorized,
	binCtrl.fetchUserBins)


app.post('/posts', 
	isAuthorized,
	isInBin,
	postCtrl.createPost)

app.delete('/posts/:postId', 
	isAuthorized,
	postCtrl.deletePost)


app.get('/posts', 
	isAuthorized,
	isInBin,
	postCtrl.fetchPosts)

app.get('/me', 
	isAuthorized,
	userCtrl.fetchAuthedUser)

app.put('/reactions/:binId/:postId/:emojiId',
	isAuthorized,
	isInBin,
	reactionCtrl.addReaction)

app.delete('/reactions/:binId/:postId/:emojiId',
	isAuthorized,
	isInBin,
	reactionCtrl.deleteReaction)

app.get('/reactions',
	isAuthorized,
	isInBin,
	reactionCtrl.fetchReactions)

app.get('/noAuth', function(req,res) {
	res.json({loginStatus: false})
})

app.get('/auth/logout/twitter', function(req, res) {
	req.logout()
	res.redirect("/noAuth")
})


app.server.listen(process.env.PORT || 3000);

console.log(`Started on port ${app.server.address().port}`);


// 	// internal middleware
// 	app.use(middleware());

// 	// api router
// 	app.use('/api', api());

	


export default app;
