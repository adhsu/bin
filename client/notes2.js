redux store
  view


================

api calls needed:

// within a bin
getPosts(binId, userId, oldestTimestamp, page)

toggleReaction(postId, userId, emojiId)

submitPost(title, url, timestamp, mediaType, reactions={})

// bin
createBin(binId, userId)
getUsers()
getBinDetails([ids])

// user
login(username, password)


==============rethinkdb===========

table posts
  id
  binId: "string"
  title: "string"
  url: "string"
  timestamp: int
  mediaType: "string"
  reactions: {"emojiId": [userIds]}

r.db('bin').table('posts').getAll("fell", {index:'binId'})

table users
  id
  username: "string"
  password
  email
  bins: [{binId: {lastViewed: timestamp}}]

table bins
  id
  binname: "string"
  title: "string"
  users: [userIds]
  posts: [postIds]


