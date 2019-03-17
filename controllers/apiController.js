/**
 * API Controllers.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const api = require('../lib/server/api-server')

const crypto = require('crypto')
// Load .env-file to environment.
require('dotenv').config()

const apiController = {}

/**
 * Verify GitHub signature middleware
 */
apiController.verifySignature = (req, res, next) => {
  try {
    let secret = process.env.WH_SECRET
    let ghSign = Buffer.from(req.get('X-Hub-Signature'))
    let compSign = Buffer.from('sha1=' + crypto.createHmac('sha1', secret)
      .update(JSON.stringify(req.body)).digest('hex'))

    if (crypto.timingSafeEqual(ghSign, compSign)) next()
  } catch (e) { res.status(401).send('Signature does not match') }
}

/**
 * index GET
 */
apiController.index = (req, res, next) => {
  res.json({ usage: 'api/<path>' })
}

/**
 * index POST
 * Handles payloads from GitHub Webhooks
 */
apiController.indexPost = (req, res, next) => {
  const io = require('../lib/server/socketio').getIO()
  try {
    // Emit only to room with same name as user for which webhook is installed
    io.in(req.params.id).emit('issue', req.body)
    res.status(204).end()
  } catch (e) { next(e) }
}

/**
 * paths GET
 * Controls what the server API should do depending on path & query
 */
apiController.paths = async (req, res, next) => {
  try {
    res.set({
      'Cache-Control': 'no-store',
      'Vary': '*'
    })
    // Query for webhooks.
    if (req.query.wh) {
      if (req.query.action === 'create') {
        let result = await api.createWebHook(req.query.path, process.env.WH_SECRET, req.session.access_token, req.session.username)
        res.json(result)
      }
      if (req.query.action === 'delete') {
        let status = await api.deleteWebHook(req.query.path, req.query.id, req.session.access_token)
        if (status === 204) {
          res.status(204).end()
        } else res.status(400).end()
      }
    } else {
      let params = req.path
      if (Object.keys(req.query).length > 0) params += '?' + require('querystring').stringify(req.query)
      let result = await api.fetchGithub(params, req.session.access_token)
      res.json(result)
    }
  } catch (e) { next(e) }
}

// Exports.
module.exports = apiController
