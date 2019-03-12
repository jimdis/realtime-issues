'use strict'

const socketio = require('socket.io')

module.exports.listen = (server) => {
  const io = socketio.listen(server)
  exports.sockets = io.sockets
  io.on('connection', (socket) => {
    // socket.on('message', function(message) {
    //     logger.log('info',message.value)
    //     socket.emit('ditConsumer',message.value)
    console.log('user connected')
  })
}
