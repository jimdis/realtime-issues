/**
 * Auth Controllers.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

// Load .env-file to environment.
require('dotenv').config()

const api = require('../lib/api')

const oauth2 = require('simple-oauth2').create({
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
  },
  auth: {
    tokenHost: 'https://github.com',
    tokenPath: '/login/oauth/access_token',
    authorizePath: '/login/oauth/authorize'
  }
})

// Authorization uri definition
const authorizationUri = oauth2.authorizationCode.authorizeURL({
  redirect_uri: 'http://localhost:3000/auth/callback',
  scope: 'repo',
  state: '3(#0/!~'
})

const authController = {}

/**
 * index GET
 */
authController.index = (req, res, next) => {
  console.log(authorizationUri)
  res.redirect(authorizationUri)
}

/**
 * callback GET
 * Callback service parsing the authorization token and asking for the access token
 */
authController.callback = async (req, res, next) => {
  const code = req.query.code
  const options = {
    code
  }

  try {
    const result = await oauth2.authorizationCode.getToken(options)

    console.log('The resulting token: ', result)

    const token = oauth2.accessToken.create(result)

    req.session.access_token = token.token.access_token
    // return res.status(200).json(token)
    res.redirect('/')
  } catch (error) {
    console.error('Access Token Error', error.message)
    return res.status(500).json('Authentication failed')
  }
}

/**
 * issues GET
 */
authController.issues = async (req, res, next) => {
  let token = req.session.access_token
  if (token) {
    let result = await api.getIssues(token)
    res.json({
      result: result
    })
  } else res.status(403).json('Authentication failed')
}

/**
 * /status GET
 */
authController.status = async (req, res, next) => {
  let status = await api.authorizeUser(req.session.access_token)
  if (status === 200) {
    res.json({ authorized: true })
  } else res.json({ authorized: false })
}

// Exports.
module.exports = authController
