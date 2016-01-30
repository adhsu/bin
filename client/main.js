import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'
import getRoutes from './routes'

require('./styles/main.styl')

import configureStore from './store/configureStore'
const {store, history} = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {getRoutes()}
    </Router>
  </Provider>,
  document.getElementById('app')
)
