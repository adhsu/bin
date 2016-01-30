import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './containers/App'
import Bin from './containers/Bin'
import Home from './containers/Home'
import About from './components/About'

export default function getRoutes() {
  return (
    <Route path="/" component={App}>
      <Route path="about" component={About}/>
      <Route path=":binId" component={Bin}/>
      <IndexRoute component={Home}/>
    </Route>
  );
}
