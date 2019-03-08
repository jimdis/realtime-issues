'use strict'
const fetch = require('node-fetch')

async function fetchGithub (params, token) {
  let res = await fetch(`https://api.github.com${params}`, {
    method: 'GET',
    headers: {
      'User-Agent': 'jimdis',
      'Accept': 'application/vnd.github.machine-man-preview+json',
      'Authorization': 'token ' + token
    }
  })
  res = await res.json()
  return res
}

async function authorizeUser (clientID, clientSecret, token) {
  console.log(`fetching https://api.github.com/applications/${clientID}/tokens/${token}`)
  let res = await fetch(`https://${clientID}:${clientSecret}@api.github.com/applications/${clientID}/tokens/${token}`, {
    method: 'GET',
    headers: {
      'User-Agent': 'jimdis',
      'Accept': 'application/vnd.github.machine-man-preview+json'
    }
  })
  return res.status
}

module.exports = {
  // getIssues: getIssues,
  authorizeUser: authorizeUser,
  fetchGithub: fetchGithub
}
