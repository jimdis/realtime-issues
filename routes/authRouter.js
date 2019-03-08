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

// GET /status
router.get('/status', controller.status)

// GET /status
router.get('/session', controller.session)

// GET /logout
router.get('/logout', controller.logout)

// Exports.
module.exports = router
