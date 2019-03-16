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

    req.session.regenerate((err) => {
      req.session.access_token = token.token.access_token
      res.redirect('/login')
      if (err) next()
    })
  } catch (error) {
    console.error('Access Token Error', error.message)
    next(error)
  }
}

/**
 * /status GET
 */
authController.status = async (req, res, next) => {
  if (!req.session.access_token) {
    res.json({ authorized: false })
  } else {
    let response = await api.authorizeUser(process.env.CLIENT_ID, process.env.CLIENT_SECRET, req.session.access_token)
    console.log(response.status)
    if (response.status === 200) {
      let body = await response.json()
      req.session.username = body.user.login
      res.status(200).json({ authorized: true, username: req.session.username })
    } else res.status(200).json({ authorized: false })
  }
}

/**
 * /session GET
 */
authController.session = async (req, res, next) => {
  console.log('SESSION CHECK: ' + req.session.access_token)
  if (req.session.access_token) {
    res.json({ active: true })
  } else res.json({ active: false })
}

/**
 * /logout GET
 */
authController.logout = async (req, res, next) => {
  let status = await api.deleteToken(process.env.CLIENT_ID, process.env.CLIENT_SECRET, req.session.access_token)
  console.log(status)
  if (status === 204) {
    req.session.destroy(err => {
      console.log('DELETED TOKEN, DESTROYING SESSION!')
      res.redirect('/')
      if (err) next(err)
    })
  } else next()
}

// Exports.
module.exports = authController
