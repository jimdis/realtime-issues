/**
 * API Controllers.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const api = require('../lib/api')

const apiController = {}

/**
 * index GET
 */
apiController.index = (req, res, next) => {
  res.json({ usage: 'api/<path>' })
}

/**
 * paths GET
 */
apiController.paths = async (req, res, next) => {
  console.log(req.query)
  let params = req.path
  if (Object.keys(req.query).length > 0) params += '?' + require('querystring').stringify(req.query)
  console.log(params)
  let result = await api.fetchGithub(params, req.session.access_token)
  res.json(result)
}

// Exports.
module.exports = apiController
