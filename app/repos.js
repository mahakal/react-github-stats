import React, { Component } from 'react';
import * as d3 from "d3";
import fetchPaginate from 'fetch-paginate';

export class Repos extends Component {
  constructor(props) {
    super(props);
    this.genRepoData = this.genRepoData.bind(this);
    this.state = {repos: [], languagesCount: []};
  }

  componentDidMount() {
    this.initialize(this.props.repoUrl);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.repoUrl !== this.props.repoUrl )
      this.initialize(nextProps.repoUrl);
  }

  initialize(repoUrl) {
    fetchPaginate(repoUrl + "?per_page=100", {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
        'user-agent': 'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
      },
    }).then(({ res, data }) => {
      // TODO: use all languages of the all repo's for pie chart calculations.
      this.setState({repos: data});
    });
  }

  genRepoData() {
    let repoData = [];
    let languages = {};

    this.state.repos.forEach(function(repo, i) {
      repoData.push(
          <li key={i}>
            <a href={repo.html_url}>{repo.name}</a>
            <ul>
              <li>Description: {repo.description}</li>
              <li>Forked: {repo.fork ? "Yes" : "No"}</li>
              <li>Created: {repo.created_at}</li>
              <li>Size: {repo.size}</li>
              <li>Stars: {repo.stargazers_count}</li>
              <li>Watchers: {repo.watchers_count}</li>
              <li>Forks: {repo.forks_count}</li>
              <li>Primary Language: {repo.language}</li>
              <li>License: {repo.license ? repo.license.name : "No License"}</li>
            </ul>
          </li>
      );
      if(repo.language in languages)
        languages[repo.language] += 1;
      else
        languages[repo.language] = 1;
    });
    let l = [];
    Object.keys(languages).map(function(languageName, index) {
      l.push({language: languageName, count: languages[languageName]});
    });

    return repoData;
  }

  render() {
    return (
      this.state.repos.length === 0 ?
      <div className="d-flex justify-content-center"><h1>Fetching Repos</h1></div>
      :
      <div className="container-fluid">
        <div className="row">
          <div className="col-3 ">
            <p>Users Repositories</p>
          </div>
        </div>

        <div className="row">
          <div className="col">
          <ol>
            {this.genRepoData()}
          </ol>
          </div>
        </div>
      </div>
    )
  }
}

export class Followers extends Component {
  constructor(props) {
    super(props);
    this.genFollowersNames = this.genFollowersNames.bind(this);
    this.state = {followers: []};
  }

  componentDidMount() {
    this.initialize(this.props.followersUrl);
  }


  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps.followersUrl);
  }

  initialize(followersUrl) {
    fetch(followersUrl, {
      headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'user-agent': 'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
      }
    })
    .then((response) => response.json())
    .then((jsonResponse) => this.setState({followers: jsonResponse}));
  }

  genFollowersNames() {
    let followersNames = [];
    this.state.followers.forEach(function(follower, i) {
      followersNames.push(<li key={i}><a href={follower.html_url}>{follower.login}</a></li>);
    });
    return followersNames;
  }

  render() {
    return (
      this.state.followers.length === 0 ?
      <div className="d-flex justify-content-center"><h1>Fetching Followers</h1></div>
      :
      <div>
        <p>Followers</p>
        <ul>{this.genFollowersNames()}</ul>
      </div>
    )
  }
}

export class Following extends Component {
  constructor(props) {
    super(props);
    this.genFollowingNames = this.genFollowingNames.bind(this);
    this.state = {following: []};
  }

  componentDidMount() {
    this.initialize(this.props.followingUrl);
  }

  componentWillReceiveProps(nextProps) {
    this.initialize(nextProps.followingUrl);
  }

  initialize(followingUrl) {
    fetch(followingUrl, {
      headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'user-agent': 'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
      }
    })
    .then((response) => response.json())
    .then((jsonResponse) => this.setState({following: jsonResponse}));
  }

  genFollowingNames() {
    let followingNames = [];
    this.state.following.forEach(function(following, i) {
      followingNames.push(<li key={i}><a href={following.html_url}>{following.login}</a></li>);
    });
    return followingNames;
  }

  render() {
    return (
      this.state.following.length === 0 ?
      <div className="d-flex justify-content-center"><h1>Fetching Following</h1></div>
      :
      <div>
        <p>Following</p>
        <ul>{this.genFollowingNames()}</ul>
      </div>
    )
  }
}
