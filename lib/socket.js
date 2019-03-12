'use strict'

const init = (io) => {
  io.on('connection', (socket) => {
    // socket.on('message', function(message) {
    //     logger.log('info',message.value)
    //     socket.emit('ditConsumer',message.value)
    console.log('user connected')
  })
}

const send = (body) => {
  console.log('Socket will send: ' + body)
}
module.exports = {
  init: init,
  send: send
}
