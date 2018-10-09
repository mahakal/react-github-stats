import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom';

import './index.css';

import {Repos, Followers, Following} from './repos.js';

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {inputNode: null};
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.history.push("/user/" + this.state.inputNode.value);
    this.state.inputNode.value = '';
  }

  render() {
    return (
      <div>
        <div className="pl-3 mb-4 pt-2 pb-1 bg-dark text-white">
          <h1>Github User Statistics</h1>
        </div>
        <div className="d-flex justify-content-center align-content-center">
          <form onSubmit={this.handleSubmit} className="form-inline">
            <input type="text" ref={(input) => this.state.inputNode = input} placeholder="Github User Name" className="form-control mr-2"/>
            <input type="submit" value="Search" className="btn btn-success my-2"/>
          </form>
        </div>
      </div>
    )
  }

}

class UserStats extends Component {

  constructor(props) {
    super(props);
    this.state = {user: {}};
  }

  componentWillMount() {
    this.initialize(this.props.match.params.userId);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.match.params.userId !== this.props.match.params.userId)
      this.initialize(nextProps.match.params.userId);
  }

  initialize(userId) {
    fetch("https://api.github.com/users/" + userId, {
      headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'user-agent': 'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
      }
    })
    .then((response) => response.json())
    .then((jsonResponse) => this.setState({user: jsonResponse}));
  }

  render() {
    return (
      (Object.keys(this.state.user).length === 0 && this.state.user.constructor === Object) ?

      <div> </div>

      :

      <Router>
        <div >
          <div className="container-fluid">

            <div className="row">
              <div className="col-12 col-lg-3 p-0 d-flex justify-content-center align-items-center">
                <h3>User Profile</h3>
              </div>
            </div>

            <br/>

            <div className="row">
              <div className="col-12 col-lg-3 p-0 d-flex justify-content-center align-items-center">
                <img className="rounded-circle p-1" src={this.state.user.avatar_url} height="250" width="250" alt="profile"/>
                <br/>
              </div>
              <div className="col-9 col-lg-9">
                <p><b>Name</b>: {this.state.user.name ? this.state.user.name : "N/A"}</p>
                <p><b>Bio</b>: {this.state.user.bio ? this.state.user.bio : "N/A"}</p>
                <p><b>Company</b>: {this.state.user.company ? this.state.user.company : "N/A"}</p>
                <p><b>Blog</b>: {this.state.user.blog ? this.state.user.blog : "N/A"}</p>
                <p><b>Location</b>: {this.state.user.location ? this.state.user.location : "N/A"}</p>
                <p><b>Email</b>: {this.state.user.email ? this.state.user.email : "N/A"}</p>
                <p><b>Open to Hiring</b>: {this.state.user.hireable ? "Yes" : "No | N/A"}</p>
                <p><b>Joined</b>: {Math.floor((new Date() - new Date(this.state.user.created_at))/31557600000)} years ago</p>
              </div>
            </div>
          </div>

          <br />
          <hr />

          <div>
            <ul className="nav nav-pills nav-fill">
              <li className="nav-item">
                <Link className="nav-link" to={`/user/${this.props.match.params.userId}/repos`}>Repositories <br/>{this.state.user.public_repos} </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/user/${this.props.match.params.userId}/followers`}>Followers <br/>{this.state.user.followers} </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/user/${this.props.match.params.userId}/following`}>Following <br/>{this.state.user.following} </Link>
              </li>
            </ul>
            </div>

            <hr />

            {/*<Route path={`/user/${this.props.match.params.userId}/overview`} render={(props) => <Overview {...props} repoUrl={this.state.user.repos_url}/>}/>*/}
            <Route path={`/user/${this.props.match.params.userId}/repos`} render={(props) => <Repos {...props} repoUrl={this.state.user.repos_url}/>}/>
            <Route path={`/user/${this.props.match.params.userId}/followers`} render={(props) => <Followers {...props} followersUrl={this.state.user.followers_url}/>}/>
            <Route path={`/user/${this.props.match.params.userId}/following`} render={(props) => <Following {...props}
            followingUrl={this.state.user.url ? this.state.user.url + "/following" : undefined}/>}/>

        </div>
      </Router>
    )
  }

}

class App extends Component {
  constructor(props) {
    super(props);
  }

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

ReactDOM.render(
  <Router>
  <App />
  </Router>, document.getElementById("root")
);
