/**
 * Socket.io setup
 *
 * @author Jim Disenstam
 * @version 1.0
 */

'use strict'

const socketio = require('socket.io')

module.exports.listen = (server) => {
  const io = socketio.listen(server)
  io.use((socket, next) => {
    let username = socket.handshake.query.username
    let token = socket.handshake.query.token

    if (token === 'abcd') {
      return next()
    }
    return next(new Error('authentication error'))
  })
  io.on('connection', (socket) => {
    console.log('id: ' + socket.id)
    let username = socket.handshake.query.username
    let token = socket.handshake.query.token
    // socket.id = username
    console.log(username + 'connected with' + token)
    console.log('new id: ' + socket.id)
    // io.to(`${username}`).emit('Testing 123')
  })
  exports.sockets = io.sockets
}
