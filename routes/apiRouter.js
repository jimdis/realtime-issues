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
router.post('/', controller.verifySignature, controller.indexPost)

// GET /paths
router.get('/*', controller.paths)

// Exports.
module.exports = router
