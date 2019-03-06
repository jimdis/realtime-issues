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

async function getIssues (token) {
  let res = await fetch('https://api.github.com/repos/1dv023/jd222qe-examination-3/issues', {
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

async function authorizeUser (token) {
  let res = await fetch('https://api.github.com/repos/1dv023/jd222qe-examination-3/issues', {
    method: 'GET',
    headers: {
      'User-Agent': 'jimdis',
      'Accept': 'application/vnd.github.machine-man-preview+json',
      'Authorization': 'token ' + token
    }
  })
  return res.status
}

module.exports = {
  getIssues: getIssues,
  authorizeUser: authorizeUser,
  fetchGithub: fetchGithub
}
