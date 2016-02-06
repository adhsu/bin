'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBin = createBin;
exports.joinBin = joinBin;
exports.editBinTitle = editBinTitle;
exports.fetchUserBins = fetchUserBins;
exports.fetchBin = fetchBin;

var _thinky = require('./../utils/thinky.js');

var _words = require('../utils/words');

var Bin = require('./../models/bins');
var Post = require('./../models/posts');
var User = require('./../models/users');

function generateInviteCode() {
  var adj = _words.adjectives[Math.floor(Math.random() * _words.adjectives.length)];
  var noun = _words.nouns[Math.floor(Math.random() * _words.nouns.length)];
  var invite_code = adj + '-' + noun;
  console.log('generating invite code', invite_code);
  return invite_code;
}

// createBin
// POST /api/bins/:id
// query params {token}
// => bin
function createBin(req, res) {
  var binId = req.params.id;
  var userId = req.token.id;

  Bin.get(binId).getJoin({ users: true }).run().then(function (bin) {
    res.json({ err: 'Bin already exists' });
  }).catch(_thinky.Errors.DocumentNotFound, function (err) {

    var bin = new Bin({
      id: binId,
      title: 'Click here to set the title...',
      invite_code: generateInviteCode()
    });

    User.get(userId).run().then(function (user) {
      bin.users = [user];
      bin.saveAll({ users: true }).then(function (result) {
        res.send(bin);
      });
    });
  });
}

// joinBin
// POST /api/bins/:id/join
// query params {token}
// body {invite_code}
// => {ok: true}
function joinBin(req, res) {

  var invite_code = req.body.invite_code;
  var binId = req.params.binId;
  var userId = req.token.id;
  // Find Bin, see that it exists, match invite_code, add user to bin

  Bin.get(binId).getJoin({ users: true }).run().then(function (bin) {
    // bin exists
    if (bin.invite_code == invite_code) {
      //invite_code matches
      User.get(userId).run().then(function (user) {
        bin.users.push(user);
        bin.saveAll({ users: true }).then(function (result) {
          res.send({
            ok: true,
            bin: bin
          });
        });
      });
    } else {
      res.send({
        ok: false,
        message: 'Ah ah ah, you didn\'t say the magic word!'
      });
    }
  }).catch(_thinky.Errors.DocumentNotFound, function (err) {
    res.json({ err: 'Bin does not exist.' });
  });
}

// editBinTitle
// POST /api/bins/:id/title
// query params {token}
// body {title}
// => {ok: true}
function editBinTitle(req, res) {
  var binId = req.params.id;
  var userId = req.token.id;
  var title = req.body.title;
  Bin.get(binId).update({ title: title }).run().then(function (bin) {
    res.json({
      ok: true,
      bin: bin
    });
  });
}

// fetchUserBins
// GET /api/bins
// query params {auth_token}
// => {bins}
function fetchUserBins(req, res) {
  var userId = req.token.id;

  User.get(userId).getJoin({ bins: { users: { avatarUrl: true, id: true, name: true } } }).run().then(function (user) {
    res.json(user.bins);
  });
}

// GET /api/bins/:id
// query params {token}
// => {ok: true}
function fetchBin(req, res) {
  var binId = req.params.id;

  Bin.get(binId).run().then(function (bin) {
    // bin exists
    res.send({ ok: true, exists: true });
  }).catch(_thinky.Errors.DocumentNotFound, function (err) {
    res.json({
      ok: false,
      exists: false,
      err: 'Bin does not exist.'
    });
  });
}
//# sourceMappingURL=bins.js.map