'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _middleware = require('./middleware');

var _middleware2 = _interopRequireDefault(_middleware);

var _api = require('./api');

var _api2 = _interopRequireDefault(_api);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _config = require('./../config');

var _config2 = _interopRequireDefault(_config);

var _thinky = require('./utils/thinky');

var _scraper = require('./utils/scraper');

var _bins = require('./api/bins');

var binCtrl = _interopRequireWildcard(_bins);

var _posts = require('./api/posts');

var postCtrl = _interopRequireWildcard(_posts);

var _users = require('./api/users');

var userCtrl = _interopRequireWildcard(_users);

var _reactions = require('./api/reactions');

var reactionCtrl = _interopRequireWildcard(_reactions);

var _tokenAuth = require('./utils/tokenAuth');

var _tokenAuth2 = _interopRequireDefault(_tokenAuth);

var _isAuthorized = require('./policies/isAuthorized');

var _isAuthorized2 = _interopRequireDefault(_isAuthorized);

var _isCurrentUser = require('./policies/isCurrentUser');

var _isCurrentUser2 = _interopRequireDefault(_isCurrentUser);

var _isInBin = require('./policies/isInBin');

var _isInBin2 = _interopRequireDefault(_isInBin);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportTwitter = require('passport-twitter');

var _passportJwt = require('passport-jwt');

var _bins2 = require('./models/bins');

var _bins3 = _interopRequireDefault(_bins2);

var _posts2 = require('./models/posts');

var _posts3 = _interopRequireDefault(_posts2);

var _users2 = require('./models/users');

var _users3 = _interopRequireDefault(_users2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var jwtOpts = {};
jwtOpts.secretOrKey = 'secret';
jwtOpts.issuer = "accounts.bin.io";
jwtOpts.audience = "bin.io";

// const callbackURL = 'http://' + config.url + ':' + config.ports.http + '/auth/login/callback';
var callbackURL = "http://107.170.209.207/auth/login/callback";

_passport2.default.use(new _passportJwt.Strategy(jwtOpts, function (jwt_payload, done) {

	_users3.default.get(jwt_payload.sub).run().then(function (users) {
		console.log(users);
		return done(null, users[0]);
	}).catch(_thinky.Errors.DocumentNotFound, function (err) {
		return done(null, false);
	});
}));

_passport2.default.use(new _passportTwitter.Strategy({
	consumerKey: _config2.default.twitter.consumerKey,
	consumerSecret: _config2.default.twitter.consumerSecret,
	callbackURL: callbackURL + '/twitter'
}, function (token, tokenSecret, profile, done) {
	var objectMapper = function objectMapper(profile) {
		return {
			'id': profile.username,
			'name': profile.displayName || null,
			'url': profile._raw.expanded_url || null,
			'avatarUrl': profile._json.profile_image_url,
			'type': 'twitter'
		};
	};
	_users3.default.get(profile.username).run().then(function (user) {

		user.token = _tokenAuth2.default.issue({ id: user.id });
		return done(null, user);
	}).catch(_thinky.Errors.DocumentNotFound, function (err) {

		var user = new _users3.default(objectMapper(profile));

		user.save().then(function (newUser) {
			newUser.token = _tokenAuth2.default.issue({ id: newUser.id });
			done(null, newUser);
		});
	});
}));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Twitter profile is serialized
// and deserialized.
_passport2.default.serializeUser(function (user, cb) {
	cb(null, user);
});

_passport2.default.deserializeUser(function (obj, cb) {
	cb(null, obj);
});

var app = (0, _express2.default)();
app.server = _http2.default.createServer(app);

app.use(require('cookie-parser')());

// 3rd party middleware
app.use((0, _cors2.default)({
	exposedHeaders: ['Link']
}));

app.use(_bodyParser2.default.json({
	limit: '100kb'
}));

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(_passport2.default.initialize());
app.use(_passport2.default.session());

app.get('/', function (req, res) {
	res.send(req.user);
});

app.get('/auth/login/twitter', _passport2.default.authenticate('twitter', { session: false }));

app.get('/auth/login/callback/twitter', _passport2.default.authenticate('twitter', { failureRedirect: '/' }), function (req, res) {
	res.redirect('http://bin.cool.s3-website-us-west-1.amazonaws.com/login?access_token=' + req.user.token);
	// res.send("/user?access_token=" + req.user.token)
});

app.get('/', function (req, res) {
	console.log(req);
	res.send(req.user);
});

app.post("/title", _scraper.grabTitle);

app.get('/user', _isAuthorized2.default, function (req, res) {
	res.send(req.user);
});

app.post('/bins/:binId/join', _isAuthorized2.default, binCtrl.joinBin);

app.post('/bins/:id', _isAuthorized2.default, binCtrl.createBin);

app.post('/bins/:id/title', _isAuthorized2.default, binCtrl.editBinTitle);

app.get('/bins', _isAuthorized2.default, binCtrl.fetchUserBins);

app.get('/bins/:id', binCtrl.fetchBin);

app.post('/posts', _isAuthorized2.default, _isInBin2.default, postCtrl.createPost);

app.delete('/posts/:postId', _isAuthorized2.default, postCtrl.deletePost);

app.get('/posts', _isAuthorized2.default, _isInBin2.default, postCtrl.fetchPosts);

app.get('/me', _isAuthorized2.default, userCtrl.fetchAuthedUser);

app.put('/reactions/:binId/:postId/:emojiId', _isAuthorized2.default, _isInBin2.default, reactionCtrl.addReaction);

app.delete('/reactions/:binId/:postId/:emojiId', _isAuthorized2.default, _isInBin2.default, reactionCtrl.deleteReaction);

app.get('/reactions', _isAuthorized2.default, reactionCtrl.fetchReactions);

app.get('/noAuth', function (req, res) {
	res.json({ loginStatus: false });
});

app.get('/auth/logout/twitter', function (req, res) {
	req.logout();
	res.redirect("/noAuth");
});

app.server.listen(process.env.PORT || 3000);

console.log('Started on port ' + app.server.address().port);

// 	// internal middleware
// 	app.use(middleware());

// 	// api router
// 	app.use('/api', api());

exports.default = app;
//# sourceMappingURL=index.js.map