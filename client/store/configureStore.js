import {createStore, applyMiddleware, combineReducers} from 'redux';
import { createHistory } from 'history'
import { syncHistory, routeReducer as routing } from 'react-router-redux'
import thunkMiddleWare from 'redux-thunk'

import reducers from '../reducers/index';

export default function configureStore(initialState) {

  const history = createHistory();
  const historyMiddleware = syncHistory(history);
  const rootReducer = combineReducers(Object.assign({}, reducers, {routing}));

  const createStoreWithMiddleware = applyMiddleware(
    historyMiddleware,
    thunkMiddleWare
  )(createStore);

  const store = createStoreWithMiddleware(rootReducer, initialState);
  historyMiddleware.listenForReplays(store);
  return {store, history};
}
