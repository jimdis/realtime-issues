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

// GET /:id
router.get('/:id', controller.id)

// Exports.
module.exports = router
