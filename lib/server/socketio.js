/**
 * Socket.io setup
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'
// Load .env-file to environment.
require('dotenv').config()

const api = require('./api-server')

let ioInstance

// Sets up instance of socket.io server, registers authentication middleware
module.exports = (server) => {
  const io = require('socket.io')(server)
  io.use(async (socket, next) => {
    if (socket.handshake.query.token) {
      let username = socket.handshake.query.username
      let token = socket.handshake.query.token
      let response = await api.authorizeUser(process.env.CLIENT_ID, process.env.CLIENT_SECRET, token)
      if (response.status === 200) {
        let body = await response.json()
        if (body.user.login === username) return next()
        return next(new Error('authentication error'))
      } else return next(new Error('authentication error'))
    } else return next(new Error('authentication error'))
  })

  io.on('connection', (socket) => {
    let username = socket.handshake.query.username
    // Join room with same name as username.
    socket.join(username)
  })
  ioInstance = io
  return io
}

// Function to access the instance if socket.io.
module.exports.getIO = () => {
  if (!ioInstance) {
    throw new Error('Must call module constructor function before you can get the IO instance')
  }
  return ioInstance
}
