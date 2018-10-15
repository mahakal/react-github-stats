import React, { Component } from 'react';
import * as d3 from "d3";
import fetchPaginate from 'fetch-paginate';

const repoCreated = (date) => Math.floor((new Date() - new Date(date))/31557600000);

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
      let userRepos = data.filter(repo => repo.fork === false).sort((a,b) => b.stargazers_count-a.stargazers_count);
      this.setState({repos: userRepos});
      this.drawPieChart(userRepos);
    });
  }

  drawPieChart(data) {
    let languages = {};
    let languagesD3Data = [];

    data.forEach(function(repo, i) {
      if(repo.language)
        if(repo.language in languages)
          languages[repo.language] += 1;
        else
          languages[repo.language] = 1;
    });

    var totalCount = 0;
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

    const width = 1000;
    const height = 200;
    const radius = 90;
    const xOffset = 30 + radius*2;
    const color = d3.scaleSequential(d3.interpolateRainbow);
    const color1 = d3.scaleSequential(d3.interpolateSinebow);

    const svg = d3.select("svg")
      .attr('viewBox',`0 0 ${width} ${height}`)
      .attr('preserveAspectRatio','xMinYMin meet');

    const g = svg.append("g")
      .attr("transform", `translate(${radius}, ${height/2})`);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const slices = d3.pie()
      .value(d => d.count)(languagesD3Data)
      .sort((a,b) => a.index-b.index);

    // donut
    g.selectAll('path')
      .data(slices)
      .enter()
      .append('path')
      .attr('class', 'slice')
      .attr('d', arc)
      .attr('fill', d => d.index%2 ? color(d.index/slices.length) : color1(d.index/slices.length));

    // legends
    var rowOffset = 0;
    const rowOffsetValue = slices.length>27 ? 120 : 250;
    const fontSize = slices.length>27 ? "8" : "16";
    svg.append('g')
      .attr('class', 'legend')
      .selectAll('text')
      .data(slices)
      .enter()
      .append('text')
      .text(d => `• ${d.data.language} (${Math.round(d.value*10000/totalCount)/100})`)
      .attr('font-size', fontSize) // depending on slice size
      .attr('fill', d => d.index%2 ? color(d.index/slices.length) : color1(d.index/slices.length))
      .attr('x', (d, i) => {
        let y = ((20 * i) % (height-20)) + 20;
        const x = xOffset + rowOffset;
        if (y === height-20)
          rowOffset += rowOffsetValue;
        return x;
      })
      .attr('y', (d, i) => {
        let y = (20 * i) % (height-20);
        return y+20;
      });
  }

  genRepoData() {
    let repoData = [];

    this.state.repos.forEach(function(repo, i) {
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

          <div className="card-body" style={{borderRadius: 0}}>
            <p className="card-text">
              {repo.description ? repo.description: "--/--"}
            </p>
          </div>

        </div>
      );
    });
    return <div>{repoData}</div>
  }

  render() {
    return (
      // TODO: check for empty result(No user repos) repos = [{}]
      this.state.repos.length === 0 ?
      <div className="d-flex justify-content-center"><h1>Fetching Repos</h1></div>
      :
      <div className="container-fluid">

        <div className="row">
          <div className="col">
            <h4 className="text-center">Languages used by {this.props.userName ? this.props.userName : "User"}</h4>
            <svg vectorEffect="non-scaling-stroke"></svg>
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
            {this.genRepoData()}
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
