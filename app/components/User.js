import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import Repos from './Repos.js';
import Followers from './Followers.js';
import Following from './Following.js';


const userCreated = (date) => Math.floor((new Date() - new Date(date))/31557600000);


export class UserForm extends Component {
  constructor(props) {
    super(props);
    this.inputNode = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.history.push("/user/" + this.inputNode.current.value);
    this.inputNode.current.value = '';
  }

  render() {
    return (
      <div>
        <div className="pl-3 mb-4 pt-2 pb-1 bg-dark text-white">
          <h1>Github User Statistics</h1>
        </div>
        <div className="d-flex justify-content-center align-content-center">
          <form onSubmit={this.handleSubmit} className="form-inline">
            <input type="text" ref={this.inputNode} placeholder="Github User Name" className="form-control mr-2"/>
            <input type="submit" value="Search" className="btn btn-success my-2"/>
          </form>
        </div>
      </div>
    )
  }

}

const UserProfile = ({userData}) => {
  const {avatar_url, name, bio, company, blog, location, email, hireable, created_at} = userData;
  return (
      <div className="row">

        <div className="col-12 col-lg-3 p-0 d-flex justify-content-center align-items-center">
          <img className="rounded-circle p-1" src={avatar_url} height="250" width="250" alt="profile"/>
          <br/>
        </div>

        <div className="col-9 col-lg-9">
          <p><b>Name</b>: {name ? name : "N/A"}</p>
          <p><b>Bio</b>: {bio ? bio : "N/A"}</p>
          <p><b>Company</b>: {company ? company : "N/A"}</p>
          <p><b>Blog</b>: {blog ? blog : "N/A"}</p>
          <p><b>Location</b>: {location ? location : "N/A"}</p>
          <p><b>Email</b>: {email ? email : "N/A"}</p>
          <p><b>Open to Hiring</b>: {hireable ? "Yes" : "No | N/A"}</p>
          <p><b>Joined</b>: {userCreated(created_at)} years ago</p>
        </div>

      </div>
  )
}

export class UserStats extends Component {

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
    const user = this.state.user;
    const userId = this.props.match.params.userId;
    return (
      (Object.keys(user).length === 0 && user.constructor === Object) ?

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

            <UserProfile userData={user}/>

          </div>

          <br />
          <hr />

          <div>
            <ul className="nav nav-pills nav-fill">
              <li className="nav-item">
                <Link className="nav-link" to={`/user/${userId}/repos`}>Repositories <br/>{user.public_repos} </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/user/${userId}/followers`}>Followers <br/>{user.followers} </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={`/user/${userId}/following`}>Following <br/>{user.following} </Link>
              </li>
            </ul>
            </div>

            <hr />

            {/*<Route path={`/user/${this.props.match.params.userId}/overview`} render={(props) => <Overview {...props} repoUrl={this.state.user.repos_url}/>}/>*/}
            <Route path={`/user/${userId}/repos`} render={(props) => <Repos {...props} repoUrl={user.repos_url} userName={user.name}/>}/>
            <Route path={`/user/${userId}/followers`} render={(props) => <Followers {...props} followersUrl={user.followers_url}/>}/>
            <Route path={`/user/${userId}/following`} render={(props) => <Following {...props} followingUrl={user.url + "/following"}/>}/>
        </div>
      </Router>
    )
  }

}
