/**
 * Account Controllers.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const User = require('../models/User')
const Snippet = require('../models/Snippet')
const moment = require('moment')

const accountController = {}

// Middleware to check if user is authorized
accountController.authorization = (req, res, next) => {
  if (req.session.userID) {
    next()
  } else {
    let message = 'You need to be logged in to view this page'
    req.session.flash = { type: 'danger', text: message }
    res.redirect('/account/login')
  }
}

/**
 * index GET
 */

accountController.index = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.session.userID })
    let date = moment(user.createdAt).format('YYYY-MM-DD')
    let snippets = await Snippet.find({ userID: user._id })
    const locals = {
      userID: user._id,
      username: user.username,
      date: date,
      snippets: snippets.length.toString()
    }
    // Make sure account page is not cached
    res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0')
    res.render('account/', { locals })
  } catch (error) {
    next(error)
  }
}

/**
 * index POST
 */
accountController.indexPost = async (req, res, next) => {
  try {
    req.session.destroy(err => { if (err) throw new Error(err) })
    res.redirect('/')
  } catch (error) {
    next(error)
  }
}

/**
 * login GET
 */
accountController.login = async (req, res, next) => res.render('account/login')

/**
 * login POST
 */
accountController.loginPost = async (req, res, next) => {
  try {
    // Run if login fails
    const loginFail = () => {
      req.session.flash = {
        type: 'danger',
        text: `Username ${req.body.username} does not exist or does not match password`
      }
      res.redirect('/login')
    }
    // Check username
    const user = await User.findOne({ username: req.body.username })
    if (!user) loginFail()
    // Check password
    let result = await user.comparePassword(req.body.password)
    if (result) {
      req.session.regenerate(err => { if (err) throw new Error(err) })
      req.session.userID = user._id
      req.session.username = user.username
      res.redirect('../snippets')
    } else loginFail()
  } catch (error) {
    next(error)
  }
}
/**
 * create GET
 */
accountController.create = async (req, res, next) => {
  const scripts = [{ script: '/js/validate.js' }]
  const locals = {
    userID: req.session.userID,
    scripts: scripts
  }
  res.render('account/create', { locals })
}

/**
 * create POST
 */
accountController.createPost = async (req, res, next) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password
    })
    await user.save()
    req.session.regenerate(err => { if (err) throw new Error(err) })
    req.session.userID = user._id
    req.session.username = user.username
    req.session.flash = { type: 'success', text: 'User Account was created successfully.' }
    res.redirect('/')
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = accountController
