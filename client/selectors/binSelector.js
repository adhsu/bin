import { createSelector } from 'reselect'

const binsSelector = state => state.bins
const currentUserSelector = state => state.currentUser
const viewSelector = state => state.view
const routingSelector = state => state.routing
const postsSelector = state => state.posts
const slugSelector = (state, props) => props.params.slug

export const binSelector = createSelector(
  binsSelector,
  currentUserSelector,
  viewSelector,
  routingSelector,
  postsSelector,
  slugSelector,
  (bins, currentUser, view, routing, posts, slug) => {
    return {
      bins,
      currentUser,
      view,
      routing,
      posts: posts[slug] || []
    }
  }
)