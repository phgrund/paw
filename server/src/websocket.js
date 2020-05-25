const socketio = require('socket.io')

const connections = []

let io

module.exports = {
  setupWebSocket(server) {
    io = socketio(server)

    io.on('connection', socket => {
      const { user } = socket.handshake.query

      console.log(socket.id)

      connections.push(socket.id)
    })
  },
  sendMessage(message) {
    connections.forEach(connection => {
      io.to(connection).emit('new-message', message)
    })
  },
  updateMessage(message) {
    connections.forEach(connection => {
      io.to(connection).emit('update-message', message)
    })
  },
  destroyMessage(message) {
    connections.forEach(connection => {
      io.to(connection).emit('destroy-message', message)
    })
  }
}
