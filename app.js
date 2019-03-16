/**
 * The starting point of the application.
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const express = require('express')
const helmet = require('helmet')
// const hbs = require('express-hbs')
const session = require('express-session')
const path = require('path')
const logger = require('morgan')
const favicon = require('serve-favicon')

const app = express()
const http = require('http').Server(app)
require('./lib/socket').listen((http))

// Initiate & configure helmet
// app.use(helmet())
// app.use(helmet.contentSecurityPolicy({
//   directives: {
//     defaultSrc: ["'self'"],
//     styleSrc: ["'self'", "'unsafe-inline'", 'stackpath.bootstrapcdn.com', 'cdnjs.cloudflare.com'],
//     scriptSrc: ["'self'", "'unsafe-inline'", 'code.jquery.com', 'cdnjs.cloudflare.com', 'stackpath.bootstrapcdn.com', 'use.fontawesome.com']
//   }
// }))

// view engine setup
// app.engine('hbs', hbs.express4({
//   defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
//   partialsDir: path.join(__dirname, 'views', 'partials')
// }))
// app.set('view engine', 'hbs')
// app.set('views', path.join(__dirname, 'views'))

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
    // secure: true in production (won't work on localhost without https) !!!!!!!!!!!
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'lax' // allowed when following a regular link from an external website, blocking it in CSRF-prone request methods (POST)
  }
}
app.use(session(sessionOptions))

// middleware to be executed before the routes
// app.use(async (req, res, next) => {
//   // flash messages - survives only a round trip
//   res.locals.flash = req.session.flash
//   delete req.session.flash

//   next()
// })

// routes
app.use('/', require('./routes/homeRouter'))
app.use('/api', require('./routes/apiRouter'))
app.use('/auth', require('./routes/authRouter'))
app.use('/push', require('./routes/pushRouter'))

// catch 404
app.use((req, res, next) => {
  res.status(404)
  res.sendFile(path.join(__dirname, 'public', '404.html'))
})

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.status(500).sendFile(path.join(__dirname, 'public', '500.html'))
})

http.listen(3000, () => console.log('Server running at http://localhost:3000/'))
