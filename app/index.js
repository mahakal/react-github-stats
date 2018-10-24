import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import { UserForm, UserStats } from './components/User.js';

import './index.css';


class App extends Component {
  render() {
    return (
      <div>
        <Route path="/" component={UserForm} />
        <hr/>
        <Route path="/user/:userId" component={UserStats} />
      </div>
    )
  }
}

ReactDOM.render(<Router><App/></Router>, document.getElementById("root"));
