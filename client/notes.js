going to bin for the first time, account already exists

login -> 
  POST /login => currentUser object
  GET /bins?userId=foo

enter bin -> 
  
  GET /posts?binId=fell&page=1 => posts array/object


scroll down -> GET /posts?foo=bar&page=2 => next page of posts

enter another bin -> GET /posts?binId=southpark&page=1 => posts in southpark



users:

   [{
      username: 'andrew'
    },
    {
      username: 'connor',
      bins: ['fell', 'southpark', 'newbin']
    },
    {
      username: 'colton'
    },
    {
      username: 'delian'
    },
    {
      username: 'jeff'
    },
    {
      username: 'eric'
    },
    {
      username: 'stedman'
    },
    {
      username: 'zain'
    }]



posts:
http://localhost:3000/posts/get?binId=fell&userId=1&timestamp=1452134637636

r.table('posts').getAll("fell", {index: 'binId'})

r.db('bin').table('posts').indexCreate('binId_timestamp', [r.row('binId'), r.row('timestamp')])

r.db('bin').table('posts')
  .between(["fell", r.minval], ["fell", r.maxval], {index: 'binId_timestamp'})
  .orderBy({index: r.desc('binId_timestamp')})
  .filter(function (post) {
    return post("timestamp").lt(lastViewed);
  })
  .skip(postsPerPage*pageNum)
  .limit(postsPerPage)


[{
      binId: "fell",
      title: null,
      url: 'https://www.youtube.com/embed/W5JqB6e5QwU',
      mediaType: 'youtube',
      timestamp: 1452134637835,
      reactions: {
        "wink": [3,2,5]
      },

      reactions: {
        "wink": {
          userVoted: true,
          num: 5
        },
        "blush": {
          userVoted: false,
          num: 3
        },
        "smile": {
          userVoted: true,
          num: 1
        }
      }
    }, 
    {
      binId: "fell",
      title: 'The Surreal Story of StubHub Screwing over a Kobe Fan',
      url: 'http://www.theleadsports.com/the-surreal-story-of-stubhub-screwing-over-a-kobe-fan/',
      mediaType: null,
      timestamp: 1452134637635,
      reactions: {}
    }, 
    {
      binId: "southpark",
      title: 'Living in a box has its perks',
      url: 'https://i.imgur.com/8QLaMxC.jpg',
      mediaType: 'image',
      timestamp: 1452134637635,
      reactions: {}
    },
    {
      binId: "southpark",
      title: 'So, you\'re telling me this is why we can\'t play?',
      url: 'http://i.imgur.com/Q9NkfmE.gif',
      mediaType: 'gif',
      timestamp: 1452134637635,
      reactions: {}
    }]