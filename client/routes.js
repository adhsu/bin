import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from './App'
import Bin from './components/Bin'
import About from './components/About'
import Home from './components/Home'

export default function getRoutes() {
  return (
    <Route path="/" component={App}>
      <Route path="about" component={About}/>
      <Route path=":slug" component={Bin}/>
      <IndexRoute component={Home}/>
    </Route>
  );
}
