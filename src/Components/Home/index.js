import React, { Component } from "react"

import RepoList from "../Repo/list"
import ContributorList from "../Contributor/list"

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isViewing: "repos"
    }
  }

  render() {
    const {
      repos,
      organization,
      totalContributionsByUser,
      organizationMembers
    } = this.props

    const { isViewing } = this.state

    const menu = (
      <p>
        <span
          style={{
            cursor: "pointer",
            color: isViewing === "repos" ? "black" : "gray"
          }}
          onClick={() => this.setState({ isViewing: "repos" })}
        >
          Repos
        </span>{" "}
        /{" "}
        <span
          style={{
            cursor: "pointer",
            color: isViewing === "contributors" ? "black" : "gray"
          }}
          onClick={() => this.setState({ isViewing: "contributors" })}
        >
          Contributors
        </span>
      </p>
    )

    return organization ? (
      <div style={{ width: "300px", margin: "auto" }}>
        <p style={{ margin: "20px 0" }}>
          Data for organization <b>{organization}</b>
        </p>

        {menu}

        {isViewing === "repos" ? (
          <RepoList repos={repos} />
        ) : (
          <ContributorList
            totalContributionsByUser={totalContributionsByUser}
            organizationMembers={organizationMembers}
          />
        )}
      </div>
    ) : null
  }
}
