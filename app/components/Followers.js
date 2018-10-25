import React, { Component } from 'react';

class Followers extends Component {
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

export default Followers;
