/**
 * Home Controllers.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const path = require('path')

// Load .env-file to environment. -REMOVE FROM THIS FILE AT PRODUCTION!!!!!!!!!!!!!
require('dotenv').config()

const homeController = {}

/**
 * index GET
 */
homeController.index = async (req, res) => {
  // req.session.access_token = process.env.API_KEY // REMOVE FROM THIS FILE AT PRODUCTION!!!!!!!!!!!!!
  console.log('SESSION AT INDEX GET: ' + req.session.access_token)
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
  res.sendFile(path.join(__dirname, '../views', 'index.html'))
}

/**
 * login GET
 */
homeController.login = async (req, res) => {
  // req.session.access_token = process.env.API_KEY // REMOVE FROM THIS FILE AT PRODUCTION!!!!!!!!!!!!!
  console.log('SESSION AT INDEX GET: ' + req.session.access_token)
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
  res.sendFile(path.join(__dirname, '../views', 'index.html'))
}

// Exports.
module.exports = homeController
