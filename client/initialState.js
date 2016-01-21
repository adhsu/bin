const initialState = {
  bins: {
    "fell": {
      id: "ed69b97c-cd29-4f70-9c0a-34d01dddf7ce",
      slug: "fell",
      description: "Bin of the Gentlesirs of Fellas Street",
      users: [0, 1, 2, 3, 4, 5, 6, 7],
      posts: [30, 29],
      lastViewed: 1453257161954
    },
    "southpark": {
      id: "aaaaaa",
      slug: "southpark",
      description: "Super Professional Bin for 112 South Park",
      users: [0, 1, 2, 3, 4],
      posts: [2, 3],
      lastViewed: 1452134637635
    }
  },
  users: {
    0: {
      id: 0,
      username: 'andrew'
    },
    1: {
      id: 1,
      username: 'connor'
    },
    2: {
      id: 2,
      username: 'colton'
    },
    3: {
      id: 3,
      username: 'delian'
    },
    4: {
      id: 4,
      username: 'jeff'
    },
    5: {
      id: 5,
      username: 'eric'
    },
    6: {
      id: 6,
      username: 'stedman'
    },
    7: {
      id: 7,
      username: 'zain'
    }
  },

  posts: {
    // 30: {
    //   id: 30,
    //   binId: "fell",
    //   title: null,
    //   url: 'https://www.youtube.com/embed/W5JqB6e5QwU',
    //   mediaType: 'youtube',
    //   timestamp: 1452134637635,
    //   reactions: {
    //     "wink": {
    //       userVoted: true,
    //       num: 5
    //     },
    //     "blush": {
    //       userVoted: false,
    //       num: 3
    //     },
    //     "smile": {
    //       userVoted: true,
    //       num: 1
    //     }
    //   }
    // }, 
    // 29: {
    //   id: 29,
    //   binId: "fell",
    //   title: 'The Surreal Story of StubHub Screwing over a Kobe Fan',
    //   url: 'http://www.theleadsports.com/the-surreal-story-of-stubhub-screwing-over-a-kobe-fan/',
    //   mediaType: null,
    //   timestamp: 1452134637635,
    //   reactions: {}
    // }, 
    // 2: {
    //   id: 2,
    //   binId: "southpark",
    //   title: 'Living in a box has its perks',
    //   url: 'https://i.imgur.com/8QLaMxC.jpg',
    //   mediaType: 'image',
    //   timestamp: 1452134637635,
    //   reactions: {}
    // },
    // 3: {
    //   id: 3,
    //   binId: "southpark",
    //   title: 'So, you\'re telling me this is why we can\'t play?',
    //   url: 'http://i.imgur.com/Q9NkfmE.gif',
    //   mediaType: 'gif',
    //   timestamp: 1452134637635,
    //   reactions: {}
    // }
  },
  currentUser: {
    id: "0f74b6ad-baa2-4f03-9c5d-4c5ea6c92216",
    username: 'connor',
    myBins: ['fell', 'southpark']
  },
  view: {
    error: "",
    isLoading: false,
    isMobile: false,
    height: null,
    width: null
  }

}

export default initialState