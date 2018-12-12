import React, { Component } from "react"

import { sortBy } from "lodash"

export default class ContributorList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      view: "internal"
    }
  }

  render() {
    const { totalContributionsByUser, organizationMembers } = this.props
    const { view } = this.state

    const menu = (
      <p>
        <span
          style={{
            cursor: "pointer",
            color: this.state.view === "internal" ? "black" : "gray"
          }}
          onClick={() => this.setState({ view: "internal" })}
        >
          Internal
        </span>{" "}
        /{" "}
        <span
          style={{
            cursor: "pointer",
            color: this.state.view === "external" ? "black" : "gray"
          }}
          onClick={() => this.setState({ view: "external" })}
        >
          External
        </span>
      </p>
    )

    const members = sortBy(
      totalContributionsByUser.filter(data =>
        view === "internal"
          ? organizationMembers.includes(data.user)
          : !organizationMembers.includes(data.user)
      ),
      "contributions"
    )
      .reverse()
      .slice(0, 100)

    return (
      <div>
        {menu}

        <h4 style={{ margin: "15px 0" }}>
          Top {Math.min(100, members.length)} {view} contributors
        </h4>

        {members.map(data => (
          <p key={data.user}>
            {data.user}: {data.contributions}
          </p>
        ))}
      </div>
    )
  }
}
