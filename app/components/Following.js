import React, { Component } from 'react';
import fetchPaginate from 'fetch-paginate';

class Following extends Component {
  constructor(props) {
    super(props);
    this.genFollowingNames = this.genFollowingNames.bind(this);
    this.state = {following: [], followingCount: -1};
  }

  componentDidMount() {
    this.initialize(this.props.followingUrl);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.followingUrl !== this.props.followingUrl)
      this.initialize(nextProps.followingUrl);
  }

  initialize(followingUrl) {
    fetchPaginate(followingUrl + "?per_page=100", {
      headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'user-agent': 'Mozilla/5.0 (platform; rv:geckoversion) Gecko/geckotrail Firefox/firefoxversion',
      }
    })
    .then(({res, data}) => this.setState({following: data, followingCount: data.length}));
  }

  genFollowingNames() {
    let followingNames = [];
    this.state.following.forEach((following, i) => {
      followingNames.push(
        <li key={i}>
          <img src={following.avatar_url} height="65px" width="65px" alt={following.login}/>
          <a href={following.html_url}>{following.login}</a>
        </li>);
    });
    return followingNames;
  }

  genFollowing() {
    if(this.state.followingCount === -1)
      return <div className="d-flex justify-content-center"><h1>Fetching Following</h1></div>;
    else if(this.state.followingCount === 0)
      return <div className="d-flex justify-content-center"><h1>User is not following anyone.</h1></div>;
    else {
      return (
        <div>
          <p>Following</p>
          <ol>{this.genFollowingNames()}</ol>
        </div>
      )
    }
  }

  render() {
    return this.genFollowing();
  }
}

export default Following;
