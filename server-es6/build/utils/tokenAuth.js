"use strict";

var jwt = require('jsonwebtoken');

module.exports.issue = function (payload) {
  return jwt.sign(payload, process.env.TOKEN_SECRET || "princess", { expiresIn: 97200 });
};

module.exports.verify = function (token, callback) {
  return jwt.verify(token, process.env.TOKEN_SECRET || "princess", {}, callback);
};
//# sourceMappingURL=tokenAuth.js.map