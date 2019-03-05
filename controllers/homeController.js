/**
 * Home Controllers.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const path = require('path')

const homeController = {}

// Middleware to call connection to GitHub API
homeController.connectAPI = (req, res, next) => {
  console.log('hej')
  next()
}

/**
 * index GET
 */
homeController.index = (req, res, next) => res.sendFile(path.join(__dirname, '../public', 'app.html'))

// Exports.
module.exports = homeController
