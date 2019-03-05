/**
 * Push Routes.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const express = require('express')
const router = express.Router()

const controller = require('../controllers/pushController')

// POST /
router.post('/', controller.indexPost)

// Exports.
module.exports = router
