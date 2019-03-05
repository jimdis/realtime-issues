'use strict'
const fetch = require('node-fetch')

// Load token from .env-file to environment.
require('dotenv').config()

let token = process.env.API_KEY

async function getIssues () {
  let res = await fetch('https://api.github.com/repos/1dv023/jd222qe-examination-3/issues', {
    method: 'GET',
    headers: {
      'User-Agent': 'jimdis',
      'Accept': 'application/vnd.github.v3+json',
      'Authorization': 'token ' + token
    }
  })
  res = await res.json()
  return res
}

module.exports = {
  getIssues: getIssues
}
