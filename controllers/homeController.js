/**
 * Home Controllers.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const path = require('path')

const homeController = {}

/**
 * index GET
 */
homeController.index = async (req, res) => {
  console.log('ip: ' + req.ip)
  console.log('ips: ' + req.ips)
  console.log('SESSION TOKEN at HOME: ' + req.session.access_token)
  res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
}

// Exports.
module.exports = homeController
