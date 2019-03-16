/**
 * API Controllers.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const api = require('../lib/server/api')
const io = require('../lib/server/socket')
const crypto = require('crypto')
// Load .env-file to environment.
require('dotenv').config()

const apiController = {}

/**
 * Verify GitHub signature middleware
 */
apiController.verifySignature = (req, res, next) => {
  let secret = process.env.WH_SECRET
  let ghSign = Buffer.from(req.get('X-Hub-Signature'))
  let compSign = Buffer.from('sha1=' + crypto.createHmac('sha1', secret)
    .update(JSON.stringify(req.body)).digest('hex'))

  if (crypto.timingSafeEqual(ghSign, compSign)) {
    next()
  } else res.status(401).send('Signature does not match')
}

/**
 * index GET
 */
apiController.index = (req, res, next) => {
  res.json({ usage: 'api/<path>' })
}

/**
 * index POST
 */
apiController.indexPost = (req, res, next) => {
  io.sockets.emit('issue', req.body)
  res.json(req.body)
}

/**
 * paths GET
 */
apiController.paths = async (req, res, next) => {
  res.set({
    'Cache-Control': 'no-store',
    'Vary': '*'
  })
  if (req.query.wh) {
    if (req.query.action === 'create') {
      let result = await api.createWebHook(req.query.path, process.env.WH_SECRET, req.session.access_token)
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
}

// Exports.
module.exports = apiController
