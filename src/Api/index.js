import CONFIG from "../Lib/config"

const { GITHUB_API_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = CONFIG

const auth = `client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_CLIENT_SECRET}`

export const fetchOrganization = (key, organization, page) =>
  fetch(
    `${GITHUB_API_URL}orgs/${organization}/${key}?page=${page}&per_page=100&${auth}`
  )
    .then(res => res.json())
    .catch(err => console.log(`ERR: ${err}`))

export const fetchContributors = url =>
  fetch(`${url}?${auth}&per_page=100`)
    .then(res => res.json())
    .catch(err => console.log(`ERR: ${err}`))
