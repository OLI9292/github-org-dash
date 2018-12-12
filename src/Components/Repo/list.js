import React, { Component } from "react"

import { sortBy } from "lodash"

export default class RepoList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortBy: "contributors_count"
    }
  }

  render() {
    const menu = (
      <p>
        <span
          style={{
            cursor: "pointer",
            color: this.state.sortBy === "contributors_count" ? "black" : "gray"
          }}
          onClick={() => this.setState({ sortBy: "contributors_count" })}
        >
          Contributors
        </span>{" "}
        /{" "}
        <span
          style={{
            cursor: "pointer",
            color: this.state.sortBy === "forks" ? "black" : "gray"
          }}
          onClick={() => this.setState({ sortBy: "forks" })}
        >
          Forks
        </span>{" "}
        /{" "}
        <span
          style={{
            cursor: "pointer",
            color: this.state.sortBy === "stargazers_count" ? "black" : "gray"
          }}
          onClick={() => this.setState({ sortBy: "stargazers_count" })}
        >
          Stars
        </span>
      </p>
    )

    const repo = data => (
      <div style={{ textAlign: "left" }} key={data.name}>
        <h3>{data.name}</h3>
        <p>
          {data.contributors_count} Contributors / {data.forks} Forks /{" "}
          {data.stargazers_count} Stars
        </p>
      </div>
    )

    return (
      <div>
        {menu}

        <h4 style={{ margin: "15px 0" }}>
          Top {Math.min(100, this.props.repos.length)} repos
        </h4>

        {sortBy(this.props.repos, this.state.sortBy)
          .reverse()
          .slice(0, 100)
          .map(repo)}
      </div>
    )
  }
}
