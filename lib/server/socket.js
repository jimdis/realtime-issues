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
  exports.sockets = io.sockets
}
