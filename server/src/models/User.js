const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: v => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),
      message: props => `${props.value} não é um email válido!`
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  genre: {
    type: String,
    enum: [
      'Masculino',
      'Feminino',
      'Não Binário',
      'Genderfluid'
    ],
    required: true
  },
  age: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    default: 'Disponível'
  },
  photoUrl: {
    type: String,
    default: '/default_avatar.png'
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
