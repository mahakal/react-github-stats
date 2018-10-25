import React, { Component } from 'react';

class Following extends Component {
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

export default Following;
