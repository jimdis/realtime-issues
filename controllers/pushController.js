/**
 * Push Controllers.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const pushController = {}

/**
 * index POST
 */
pushController.indexPost = async (req, res, next) => {
  console.log(req.headers)
  console.log(req.body)
}

// Exports.
module.exports = pushController
