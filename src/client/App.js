import React from 'react';
import {Route, Switch} from 'react-router-dom';

import './App.css';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Post from './pages/Post';

const App = () => (
  <Switch>
    <Route exact path="/" component={Home}/>
    <Route exact path="/blog/:id" component={Blog}/>
    <Route exact path="/post" component={Post}/>
  </Switch>
);

export default App;
