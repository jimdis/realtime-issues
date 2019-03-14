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

async function createWebHook (path, secret, token) {
  let body = {
    name: 'web',
    active: true,
    events: [
      'issues',
      'issue_comment'
    ],
    config: {
      url: 'https://71af2925.ngrok.io/api',
      content_type: 'json',
      secret: secret
    }
  }
  let res = await fetch(`https://api.github.com/repos/${path}/hooks`, {
    method: 'POST',
    headers: {
      'User-Agent': 'jimdis',
      'Accept': 'application/vnd.github.machine-man-preview+json',
      'Authorization': 'token ' + token
    },
    body: JSON.stringify(body)
  })
  res = await res.json()
  return res
}

async function deleteWebHook (path, id, token) {
  let res = await fetch(`https://api.github.com/repos/${path}/hooks/${id}`, {
    method: 'DELETE',
    headers: {
      'User-Agent': 'jimdis',
      'Accept': 'application/vnd.github.machine-man-preview+json',
      'Authorization': 'token ' + token
    }
  })
  return res.status
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
  return res
}

async function deleteToken (clientID, clientSecret, token) {
  console.log(`fetching https://api.github.com/applications/${clientID}/tokens/${token}`)
  let res = await fetch(`https://${clientID}:${clientSecret}@api.github.com/applications/${clientID}/tokens/${token}`, {
    method: 'DELETE',
    headers: {
      'User-Agent': 'jimdis',
      'Accept': 'application/vnd.github.machine-man-preview+json'
    }
  })
  return res.status
}

module.exports = {
  // getIssues: getIssues,
  fetchGithub: fetchGithub,
  createWebHook: createWebHook,
  deleteWebHook: deleteWebHook,
  authorizeUser: authorizeUser,
  deleteToken: deleteToken
}
