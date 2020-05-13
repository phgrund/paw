require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

mongoose.connect(`mongodb://localhost:27017/paw`, {
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
app.use('/api', require('./routes'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})