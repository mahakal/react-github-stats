import React, { Component } from 'react';
import fetchPaginate from 'fetch-paginate';

class Followers extends Component {
  constructor(props) {
    super(props);
    this.genFollowersNames = this.genFollowersNames.bind(this);
    this.state = {followers: [], followersCount: -1};
  }

  componentDidMount() {
    this.initialize(this.props.followersUrl);
  }


  componentWillReceiveProps(nextProps) {
    if(nextProps.followersUrl !== this.props.followersUrl)
      this.initialize(nextProps.followersUrl);
  }

  initialize(followersUrl) {
    fetchPaginate(followersUrl + "?per_page=100", {
      headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'user-agent': 'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
      }
    })
    .then(({res, data}) => this.setState({followers: data, followersCount: data.length}));
  }

  genFollowersNames() {
    let followersNames = [];
    this.state.followers.forEach((follower, i) => {
      followersNames.push(
        <li key={i}>
          <img src={follower.avatar_url} height="65px" width="65px" alt={follower.login}/>
          <a href={follower.html_url}>{follower.login}</a>
        </li>
      );
    });
    return followersNames;
  }

  genFollowers() {
    if(this.state.followersCount === -1)
      return <div className="d-flex justify-content-center"><h1>Fetching Followers</h1></div>;
    else if(this.state.followersCount === 0)
      return <div className="d-flex justify-content-center"><h1>User has no followers</h1></div>;
    else {
      return (
        <div>
          <p>Followers</p>
          <ol>{this.genFollowersNames()}</ol>
        </div>
      );
    }
  }

  render() {
    return this.genFollowers();
  }
}

export default Followers;
