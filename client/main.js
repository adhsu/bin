import React from 'react'
import ReactDOM from 'react-dom'
import {applyMiddleware, compose, createStore, combineReducers} from 'redux'
import {Provider} from 'react-redux'
import { Router, Route, IndexRoute } from 'react-router'
import { createHistory } from 'history'
import { syncHistory, routeReducer as routing } from 'redux-simple-router'
import thunk from 'redux-thunk'

import initialState from './initialState'
import reducers from './reducers'
import getRoutes from './routes'

require('./styles/main.styl');


const history = createHistory();
const historyMiddleware = syncHistory(history);
const rootReducer = combineReducers(Object.assign({}, reducers, {routing}));

const createStoreWithMiddleware = applyMiddleware(historyMiddleware, thunk)(createStore);
const store = createStoreWithMiddleware(rootReducer, initialState);
historyMiddleware.listenForReplays(store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {getRoutes()}
    </Router>
  </Provider>,
  document.getElementById('app')
)
