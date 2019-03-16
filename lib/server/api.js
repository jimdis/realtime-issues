/**
 * API Library.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'
const fetch = require('node-fetch')
const webhookURL = require('../config').webHookURL

// Fetches and returns JSON from GitHub API.
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

// Creates a webhook for issues and issue comments.
async function createWebHook (path, secret, token) {
  let body = {
    name: 'web',
    active: true,
    events: [
      'issues',
      'issue_comment'
    ],
    config: {
      url: webhookURL,
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

// Deletes a webhook.
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

// Checks if a token is valid.
async function authorizeUser (clientID, clientSecret, token) {
  let res = await fetch(`https://${clientID}:${clientSecret}@api.github.com/applications/${clientID}/tokens/${token}`, {
    method: 'GET',
    headers: {
      'User-Agent': 'jimdis',
      'Accept': 'application/vnd.github.machine-man-preview+json'
    }
  })
  return res
}

// Deletes a token.
async function deleteToken (clientID, clientSecret, token) {
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
  fetchGithub: fetchGithub,
  createWebHook: createWebHook,
  deleteWebHook: deleteWebHook,
  authorizeUser: authorizeUser,
  deleteToken: deleteToken
}
