const mongoose = require('mongoose')

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: { currentTime: () => new Date(new Date() - new Date().getTimezoneOffset() * 60 * 1000) } })

module.exports = mongoose.model('Message', MessageSchema)
