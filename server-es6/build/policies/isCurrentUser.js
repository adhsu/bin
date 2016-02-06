'use strict';

module.exports = function (req, res, next) {

  var userId = req.query.userId;
  var currentUserId = req.token.id;

  if (userId != currentUserId) {
    return res.json({ Error: 'You are not allowed to do that' });
  }

  next();
};
//# sourceMappingURL=isCurrentUser.js.map