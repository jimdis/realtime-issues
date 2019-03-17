/**
 * Auth Controllers.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const redirectURI = require('../config/config').redirect_uri

// Load .env-file to environment.
require('dotenv').config()

const api = require('../lib/server/api-server')

// Set up oauth2.
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
  redirect_uri: redirectURI,
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
    const token = oauth2.accessToken.create(result)
    console.log('TOKEN RECEIVED: ' + token.token.access_token)

    req.session.regenerate((err) => {
      req.session.access_token = token.token.access_token
      console.log('TOKEN WRITTEN TO SESSION: ' + req.session.access_token)
      res.redirect('/')
      if (err) next(err)
    })
  } catch (e) { next(e) }
}

/**
 * /status GET
 * Checks if client has a valid access token.
 */
authController.status = async (req, res, next) => {
  try {
    res.set({
      'Cache-Control': 'no-store',
      'Vary': '*'
    })
    if (!req.session.access_token) {
      res.json({ authorized: false })
    } else {
      let response = await api.authorizeUser(process.env.CLIENT_ID, process.env.CLIENT_SECRET, req.session.access_token)
      if (response.status === 200) {
        let body = await response.json()
        req.session.username = body.user.login
        res.json({ authorized: true, username: req.session.username, token: req.session.access_token })
      } else res.json({ authorized: false })
    }
  } catch (e) { next(e) }
}

/**
 * /session GET
 * Checks if there is an access token in the current session.
 */
authController.session = async (req, res, next) => {
  try {
    res.set({
      'Cache-Control': 'no-store',
      'Vary': '*'
    })
    if (req.session.access_token) {
      res.json({ active: true })
    } else res.json({ active: false })
  } catch (e) { next(e) }
}

/**
 * /logout GET
 */
authController.logout = async (req, res, next) => {
  try {
    let status = await api.deleteToken(process.env.CLIENT_ID, process.env.CLIENT_SECRET, req.session.access_token)
    if (status === 204) {
      req.session.destroy(err => {
        res.redirect('/')
        if (err) next(err)
      })
    } else next()
  } catch (e) { next(e) }
}

// Exports.
module.exports = authController
