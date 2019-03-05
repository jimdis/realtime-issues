/**
 * Snippets Controllers.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const Snippet = require('../models/Snippet')
const User = require('../models/User')

const snippetsController = {}

// Middleware to check if user is authorized
snippetsController.authorization = (req, res, next) => {
  if (req.session.userID) {
    next()
  } else {
    let path = req.path.substr(1, 1)
    let message = 'You need to be logged in to view this page'
    if (path === 'c') message = 'You need to be logged in to create new snippets'
    if (path === 'e') message = 'You don\'t have access to modify this snippet'
    if (path === 'd') message = 'You don\'t have access to delete this snippet'
    req.session.flash = { type: 'danger', text: message }
    res.redirect('/snippets')
  }
}

/**
 * index GET
 */

snippetsController.index = async (req, res, next) => {
  try {
    // Load client-side scripts
    const scripts = [
      { script: '/js/snippetsFilter.js' },
      { script: '/js/copyToClipboard.js' }
    ]
    const snippets = await Snippet.find({})
    const locals = {
      userID: req.session.userID,
      filterByAuthor: req.query.author,
      snippets: snippets.map(snippet => ({
        id: snippet._id,
        title: snippet.title,
        description: snippet.description,
        author: snippet.author,
        language: snippet.language,
        content: snippet.content,
        editable: snippet.userID === req.session.userID
      })),
      scripts: scripts
    }
    res.render('snippets/index', { locals })
  } catch (error) {
    next(error)
  }
}

/**
 * create GET
 */
snippetsController.create = async (req, res, next) => {
  try {
    const scripts = [{ script: '/js/languageFinder.js' }]
    const locals = {
      userID: req.session.userID,
      scripts: scripts
    }
    res.render('snippets/create', { locals })
  } catch (error) {
    next(error)
  }
}

/**
 * create POST
 */
snippetsController.createPost = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.body.userID })
    const snippet = new Snippet({
      userID: req.body.userID,
      author: user.username,
      title: req.body.title,
      description: req.body.description,
      language: req.body.language,
      content: req.body.content
    })
    await snippet.save()
    req.session.flash = { type: 'success', text: 'Snippet was created successfully.' }
    res.redirect('.')
  } catch (error) {
    next(error)
  }
}

/**
 * edit GET
 */
snippetsController.edit = async (req, res, next) => {
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id })
    // Check that user is authorized to edit snippet
    if (req.session.userID !== snippet.userID) {
      req.session.flash = {
        type: 'danger',
        text: 'You do not have access to modify this snippet'
      }
      res.redirect('/snippets')
    }
    // Load client-side scripts
    const scripts = [{ script: '/js/languageFinder.js' }]
    const locals = {
      snippetID: snippet._id,
      userID: snippet.userID,
      author: snippet.author,
      title: snippet.title,
      description: snippet.description,
      language: snippet.language,
      content: snippet.content,
      scripts: scripts
    }
    res.render('snippets/edit', { locals })
  } catch (error) {
    next(error)
  }
}

/**
 * edit POST
 */
snippetsController.editPost = async (req, res, next) => {
  try {
    const snippet = await Snippet.findOne({ _id: req.body.snippetID })
    // Check that user is authorized to edit snippet
    if (req.session.userID !== snippet.userID) {
      req.session.flash = {
        type: 'danger',
        text: 'You do not have access to modify this snippet'
      }
      res.redirect('/snippets')
    }
    const result = await Snippet.updateOne({ _id: req.body.snippetID },
      {
        title: req.body.title,
        description: req.body.description,
        language: req.body.language,
        content: req.body.content
      })
    if (result.nModified === 1) {
      req.session.flash = { type: 'success', text: 'Your Snippet was updated successfully.' }
    } else {
      req.session.flash = {
        type: 'danger',
        text: `There was a problem with updating your snippet: ${result}`
      }
    }
    res.redirect('.')
  } catch (error) {
    next(error)
  }
}

/**
 * delete GET
 */
snippetsController.delete = async (req, res, next) => {
  try {
    const snippet = await Snippet.findOne({ _id: req.params.id })
    // Check that user is authorized to delete snippet
    if (req.session.userID !== snippet.userID) {
      req.session.flash = {
        type: 'danger',
        text: 'You do not have access to delete this snippet'
      }
      res.redirect('/snippets')
    }
    await Snippet.deleteOne({ _id: req.params.id })
    req.session.flash = { type: 'success', text: 'Snippet was removed successfully.' }
    res.redirect('..')
  } catch (error) {
    next(error)
  }
}

// Exports.
module.exports = snippetsController
