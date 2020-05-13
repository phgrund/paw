const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  name: {
    type: String,
    minlength: 3,
    default: 'Anônimo'
  }
}, { timestamps: true })

UserSchema.pre('save', function(next) {
  if(!this.isModified('password'))
    return next()
  bcrypt.hash(this.password, 10, (err, encrypted) => {
    this.password = encrypted
    return next()
  })
})

UserSchema.methods.comparePassword = async function(password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, (err, success) => {
      if(err)
        reject(err)
      resolve(success)
    })
  })
}

module.exports = mongoose.model('User', UserSchema)
