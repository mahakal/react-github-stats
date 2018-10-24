import React, { Component } from 'react';
import * as d3 from "d3";
import fetchPaginate from 'fetch-paginate';


const repoCreated = (date) => Math.floor((new Date() - new Date(date))/31557600000);

// TODO: change to stateless functional(generate chart only once) presentaitional component
class PieChart extends Component {

  constructor(props) {
    super(props);
    const width = 1000;
    const height = 200;
    const radius = 90;
    const xOffset = 30 + radius*2;
    const color = d3.scaleSequential(d3.interpolateRainbow);
    const color1 = d3.scaleSequential(d3.interpolateSinebow);

    this.state = {
      width: width, height: height, radius: radius, xOffset: xOffset, color: color, color1: color1
    }

  }

  drawPieChart(data) {
    let languages = {};
    let languagesD3Data = [];

    data.forEach((repo, i) => {
      if(repo.language)
        if(repo.language in languages)
          languages[repo.language] += 1;
        else
          languages[repo.language] = 1;

        });
    let totalCount = 0;
    Object.keys(languages).map(function(languageName, index) {
      languagesD3Data.push({language: languageName, count: languages[languageName]});
      totalCount += languages[languageName];
    });

    /*
     if rootSvg width=undefined/notSet height=undefined/notSet
     then rootSvg's width = parent-container-width
     and rootSvg's height = rootSvg's width * viewBox's aspectRatio(width/height).
     and user cordinate xmax = viewBox's width-1, ymax= viewBox's height-1
    */
    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(this.state.radius);

    const slices = d3.pie()
      .value(d => d.count)(languagesD3Data)
      .sort((a,b) => a.index-b.index);

    let pathArray = slices.map((slice,i) =>
      <path className="slice" d={arc(slice)} fill={i%2 ? this.state.color(i/slices.length) : this.state.color1(i/slices.length)} />
    );

    // legends
    var rowOffset = 0;
    const rowOffsetValue = slices.length>27 ? 120 : 250;
    const fontSize = slices.length>27 ? "8" : "16";
    let x = 0;

    let textArray = slices.map((slice,i) =>
      <text
        fontSize={fontSize}
        fill={i%2 ? this.state.color(i/slices.length) : this.state.color1(i/slices.length)}
        // TODO: refactor ugly code
        x={(function(ref) {
            const x = ref.state.xOffset + rowOffset;
            if (((20 * i) % (ref.state.height-20)) + 20 === ref.state.height-20)
              rowOffset += rowOffsetValue;
            return x;
          })(this)
        }
        y={((20 * i) % (this.state.height-20)) + 20}>
          {`• ${slice.data.language} (${Math.round(slice.value*10000/totalCount)/100})`}
      </text>
    );
    return {p: pathArray, t: textArray};
  }

  render() {
    const d1 = this.drawPieChart(this.props.data);
    return (
      <svg vectorEffect="non-scaling-stroke" viewBox={`0 0 ${this.state.width} ${this.state.height}`} preserveAspectRatio="xMinYMin meet">
        <g transform={`translate(${this.state.radius}, ${this.state.height/2})`}>
          {d1.p}
        </g>
        <g className="legend">
          {d1.t}
        </g>
      </svg>
    )
  }
}

// TODO: change to presentaitional component
class Repo extends Component {

  constructor(props) {
    super(props);
    this.genRepoData = this.genRepoData.bind(this);
  }

  genRepoData(data) {
    let repoData = [];

    data.forEach((repo, i) => {
      repoData.push(
        <div className="card text-white bg-dark mb-3">

          <div className="card-header">
            <div className="card-title d-flex justify-content-between">
              <h4><a href={repo.html_url} className="card-link">{repo.name}</a></h4>
              <p>{repoCreated(repo.created_at) + ' years ago '}</p>
            </div>
            <h6 className="card-subtitle mb-2 text-muted">
              Stars: {repo.stargazers_count + ' | '}
              Forks: {repo.forks_count + ' | '}
              Primary Language: {repo.language ? repo.language + ' | ' : "No Language | "}
              {repo.license ? repo.license.name + ' ' : "No License "}
            </h6>
          </div>

          <div className="card-body">
            <p className="card-text">
              {repo.description ? repo.description: "--/--"}
            </p>
          </div>

        </div>
      );
    });
    return repoData;
  }

  render() {
    return (
      <div>
        {this.genRepoData(this.props.data)}
      </div>
    )
  }
}

export class Repos extends Component {
  constructor(props) {
    super(props);
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
      let userRepos = data.filter(repo => repo.fork === false).sort((a,b) => b.stargazers_count-a.stargazers_count);
      this.setState({repos: userRepos});
    });
  }

  render() {
    return (
      // TODO: check for empty result(No user repos) repos = [{}]
      this.state.repos.length === 0 ?
      <div className="d-flex justify-content-center"><h1>Fetching Repos</h1></div>
      :
      <div className="container-fluid">
        {/* TODO: floating sidebar for arranging repos acc. to stars, forks, primary language, etc.
            TODO: consistent layout for repos, follower, following */}
        <div className="row">
          <div className="col">
            <h4 className="text-center">Languages used by {this.props.userName ? this.props.userName : "User"}</h4>
            <PieChart data={this.state.repos}/>
          </div>
        </div>

        <br/>

        <div className="row">
          <div className="col">
            <h2>Users Repositories</h2>
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Repo data={this.state.repos}/>
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
