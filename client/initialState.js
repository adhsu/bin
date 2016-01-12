const initialState = {
  posts: {
    30: {
      id: 30,
      title: null,
      url: 'https://www.youtube.com/embed/W5JqB6e5QwU',
      mediaType: 'youtube',
      timestamp: 1452134637635,
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
    1: {
      id: 1,
      title: 'The Surreal Story of StubHub Screwing over a Kobe Fan',
      url: 'http://www.theleadsports.com/the-surreal-story-of-stubhub-screwing-over-a-kobe-fan/',
      mediaType: null,
      timestamp: 1452134637635,
      reactions: {}
    }, 
    2: {
      id: 2,
      title: 'Living in a box has its perks',
      url: 'https://i.imgur.com/8QLaMxC.jpg',
      mediaType: 'image',
      timestamp: 1452134637635,
      reactions: {}
    },
    3: {
      id: 3,
      title: 'So, you\'re telling me this is why we can\'t play?',
      url: 'http://i.imgur.com/Q9NkfmE.gif',
      mediaType: 'gif',
      timestamp: 1452134637635,
      reactions: {}
    }
  },
  currentUser: {
    id: 1,
    username: 'connor'
  },
  view: {
    error: ""
  }

}

export default initialState