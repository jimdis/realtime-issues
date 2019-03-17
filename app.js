/**
 * The starting point of the application.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const createError = require('http-errors')
const express = require('express')
const helmet = require('helmet')
const session = require('express-session')
const path = require('path')
const logger = require('morgan')
const favicon = require('serve-favicon')

const app = express()
const http = require('http').Server(app)
require('./lib/server/socketio')(http)

// Initiate & configure helmet
app.use(helmet())
app.use(helmet.contentSecurityPolicy({
  directives: {
    defaultSrc: ["'self'"],
    imgSrc: ["'self'", '*.githubusercontent.com'],
    styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com', 'cdnjs.cloudflare.com'],
    scriptSrc: ["'self'", "'unsafe-eval'", 'cdnjs.cloudflare.com'],
    fontSrc: ["'self'", 'fonts.gstatic.com']
  }
}))

// additional middleware
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// setup and use session middleware (https://github.com/expressjs/session)
const sessionOptions = {
  name: 'issues', // Don't use default session cookie name.
  secret: 'sC#TvqLFMYG27CLr4A%@UTkqM&M9iwa', // Change it!!! The secret is used to hash the session with HMAC.
  resave: false, // Resave even if a request is not changing the session.
  saveUninitialized: false, // Don't save a created but not modified session.
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'lax' // allowed when following a regular link from an external website, blocking it in CSRF-prone request methods (POST)
  }
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sessionOptions.cookie.secure = true // serve secure cookies
}

app.use(session(sessionOptions))

// routes
app.use('/', require('./routes/homeRouter'))
app.use('/api', require('./routes/apiRouter'))
app.use('/auth', require('./routes/authRouter'))
app.use('*', (req, res, next) => next(createError(404)))

// Error handler.
app.use((err, req, res, next) => {
  // 404 Not Found.
  if (err.statusCode === 404) {
    return res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res.status(500).sendFile(path.join(__dirname, 'views', '500.html'))
  }

  // Development only!
  res.status(err.status || 500).send(err.message)
})

http.listen(3000, () => console.log('Server running at http://localhost:3000/'))
