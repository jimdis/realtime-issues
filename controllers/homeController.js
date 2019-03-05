/**
 * Home Controllers.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const path = require('path')
const api = require('../lib/api')

const homeController = {}

// Middleware to call connection to GitHub API
homeController.connectAPI = async (req, res, next) => {
  let result = await api.getIssues()
  console.log(result)
  next()
}

/**
 * index GET
 */
homeController.index = (req, res, next) => res.sendFile(path.join(__dirname, '../public', 'app.html'))

// Exports.
module.exports = homeController
