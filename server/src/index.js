require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const { setupWebSocket } = require('./websocket')

const app = express()
const server = require('http').Server(app)

setupWebSocket(server)

// const io = require('socket.io')(http)

// io.on('connection', (socket) => {
//   socket.emit('message', {
//     content: '123'
//   })
//   console.log('connected')
// })

mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})

mongoose.connection.on('error', (err) => {
  console.log('Erro na conexão com o MongoDB.')
})

mongoose.connection.on('connected', () => {
  console.log('MongoDB conectado.')
})

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB desconectado.')
})

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, '../../client/dist')))
app.use('/api', require('./routes'))
app.use(express.static(path.join(__dirname, '../public')))
console.log(path.join(__dirname, '../public'))
app.use((req, res, next) => {
  console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
  res.redirect('/')
})

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
