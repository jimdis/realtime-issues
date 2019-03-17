/**
 * API Routes.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/apiController')

// GET /
router.get('/', controller.index)

// POST /
router.post('/:id', controller.verifySignature, controller.indexPost)

// GET /paths
router.get('/*', controller.paths)

// // POST /:id
// router.post('/:id', controller.verifySignature, controller.idPost)

// Exports.
module.exports = router
