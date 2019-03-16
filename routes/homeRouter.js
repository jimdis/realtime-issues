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

// Exports.
module.exports = router
