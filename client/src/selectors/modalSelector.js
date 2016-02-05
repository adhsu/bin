import { createSelector } from 'reselect'

const currentUserSelector = state => state.currentUser
const slugSelector = (state, props) => props.params.slug

export const modalSelector = createSelector(
  currentUserSelector,
  slugSelector,
  (currentUser, binSlug) => {
    return {
      currentUser,
      binSlug
    }
  }
)