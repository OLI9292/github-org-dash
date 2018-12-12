import React, { Component } from "react"
import { pick, flatten, groupBy, sum } from "lodash"

import Home from "../Home/"

import { fetchOrganization, fetchContributors } from "../../Api/"

const REPO_ATTRS = ["name", "stargazers_count", "forks", "contributors_url"]

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  // Sorry for the long method - would refactor in a larger project
  //
  // API calls are made to load all of an organization's member and repos,
  // then to each repo's contributors_url
  //
  async loadData(organization) {
    if (this.state.isNetworking) return
    this.clearDataForNewSearch()

    if (!organization) {
      return this.setState({
        error: "Please enter an organization in the search box.",
        isNetworking: false
      })
    }

    const reposResult = await this.loadOrganization("repos", organization)
    if (!Array.isArray(reposResult)) {
      return this.setState({ error: reposResult, isNetworking: false })
    }
    const repos = reposResult.map(repo => pick(repo, REPO_ATTRS))

    const organizationMembers = (await this.loadOrganization(
      "public_members",
      organization
    )).map(({ login }) => login)

    const contributors = await Promise.all(
      repos.map(repo => fetchContributors(repo.contributors_url))
    )

    repos.forEach((repo, idx) => {
      repo.contributors_count = contributors[idx].length
    })

    const contributionsByUser = groupBy(flatten(contributors), "login")
    const totalContributionsByUser = Object.keys(contributionsByUser).map(
      user => ({
        user,
        contributions: sum(
          contributionsByUser[user].map(({ contributions }) => contributions)
        )
      })
    )

    this.setState({
      repos,
      organizationMembers,
      totalContributionsByUser,
      organization,
      isNetworking: false
    })
  }

  clearDataForNewSearch() {
    this.setState({
      repos: undefined,
      organizationMembers: undefined,
      totalContributionsByUser: undefined,
      organization: undefined,
      isNetworking: true,
      error: undefined
    })
  }

  async loadOrganization(type, organization) {
    const data = []
    let moreResults = true
    let page = 1

    while (moreResults) {
      const result = await fetchOrganization(type, organization, page)
      if (!Array.isArray(result)) return result.message
      data.push(...result)
      moreResults = result.length === 100
      page += 1
    }

    return data
  }

  render() {
    const {
      repos,
      totalContributionsByUser,
      input,
      organizationMembers,
      organization,
      error,
      isNetworking
    } = this.state

    return (
      <div style={{ textAlign: "center" }}>
        <h1>Github Organization Dashboard</h1>

        <form
          onSubmit={e => {
            e.preventDefault()
            this.loadData(this.state.input)
          }}
        >
          <input
            onChange={e => this.setState({ input: e.target.value })}
            value={this.state.input || ""}
            type="text"
            placeholder="ex. Facebook"
          />
          <input type="submit" />
        </form>

        {isNetworking && <p>Fetching data from server...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <Home
          organization={organization}
          repos={repos || []}
          organizationMembers={organizationMembers || []}
          totalContributionsByUser={totalContributionsByUser || []}
        />
      </div>
    )
  }
}
