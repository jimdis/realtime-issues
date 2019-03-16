/**
 * Home Routes.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/homeController')

// GET /
router.get('/', controller.index)

// GET /login
router.get('/login', controller.login)

// Exports.
module.exports = router
