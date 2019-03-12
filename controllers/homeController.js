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
  req.session.access_token = process.env.API_KEY // REMOVE FROM THIS FILE AT PRODUCTION!!!!!!!!!!!!!
  res.sendFile(path.join(__dirname, '../public', 'app.html'))
}

// Exports.
module.exports = homeController
