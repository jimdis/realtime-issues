/**
 * Auth Routes.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/authController')

// GET /
router.get('/', controller.index)

// GET /callback
router.get('/callback', controller.callback)

// GET /issues
router.get('/issues', controller.issues)

// Exports.
module.exports = router
