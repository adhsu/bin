module.exports = function(req, res, next) {
  
  var userId = req.query.id;
  var currentUserId = req.token.id;
  console.log(userId, currentUserId)

  if (userId != currentUserId) {
    return res.json({Error : 'You are not allowed to do that'});
  }

  next();
};