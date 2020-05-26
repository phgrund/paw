const socketio = require('socket.io')

const connections = []

let io

module.exports = {
  setupWebSocket(server) {
    io = socketio(server)

    io.on('connection', socket => {
      connections.push(socket.id)

      io.on('disconnect', () => {
        let index = connections.indexOf(socket.id)
        connections.splice(index, 1)
      })
    })
  },
  sendMessage(message) {
    // connections.forEach(connection => {
    //   io.to(connection).emit('new-message', message)
    // })
    io.sockets.emit('new-message', message)
  },
  updateMessage(message) {
    // connections.forEach(connection => {
    //   io.to(connection).emit('update-message', message)
    // })
    io.sockets.emit('update-message', message)
  },
  destroyMessage(message) {
    // connections.forEach(connection => {
    //   io.to(connection).emit('destroy-message', message)
    // })
    io.sockets.emit('destroy-message', message)
  },
  newUser(user) {
    // connections.forEach(connection => {
    //   io.to(connection).emit('new-user', user)
    // })
    io.sockets.emit('new-user', user)
  },
  updateUser(user) {
    // connections.forEach(connection => {
      //   io.to(connection).emit('update-user', user)
      // })
    io.sockets.emit('update-user', user)
  }
}
