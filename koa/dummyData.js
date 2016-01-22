var r = require('rethinkdb')

module.exports.bins = [
  {
    id: 'ed69b97c-cd29-4f70-9c0a-34d01dddf7ce',
    slug: 'fell',
    title: "Fell St Bin",
    users: ['0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216'],
    createdAt: r.now().toEpochTime().mul(1000) 
  }
]

module.exports.users = [
  {
    id: '0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216',
    username: "adhsu",
    password: 'beep',
    email: 'adhsu01@gmail.com',
    bins: [],
    createdAt: r.now().toEpochTime().mul(1000) 
  }
]

module.exports.posts = [
  {
    author: '0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216',
    binId: 'ed69b97c-cd29-4f70-9c0a-34d01dddf7ce',
    binSlug: 'fell',
    title: "Trumpet Solo 1",
    url: "http://imgur.com/hziqUul.gif",
    createdAt: r.now().toEpochTime().mul(1000).add(4),
    mediaType: "gif",
    reactions: {
      "wink": ['0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216']
    }
  },
  {
    author: '0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216',
    binId: 'ed69b97c-cd29-4f70-9c0a-34d01dddf7ce',
    binSlug: 'fell',
    title: "Trumpet Solo 2",
    url: "http://imgur.com/hziqUul.gif",
    createdAt: r.now().toEpochTime().mul(1000).add(3),
    mediaType: "gif",
    reactions: {
      "wink": ['0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216']
    }
  },
  {
    author: '0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216',
    binId: 'ed69b97c-cd29-4f70-9c0a-34d01dddf7ce',
    binSlug: 'fell',
    title: "Trumpet Solo 3",
    url: "http://imgur.com/hziqUul.gif",
    createdAt: r.now().toEpochTime().mul(1000).add(2),
    mediaType: "gif",
    reactions: {
      "wink": ['0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216']
    }
  },
  {
    author: '0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216',
    binId: 'ed69b97c-cd29-4f70-9c0a-34d01dddf7ce',
    binSlug: 'fell',
    title: "Trumpet Solo 4",
    url: "http://imgur.com/hziqUul.gif",
    createdAt: r.now().toEpochTime().mul(1000).add(1),
    mediaType: "gif",
    reactions: {
      "wink": ['0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216']
    }
  }
]