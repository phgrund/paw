// File Handler
const path = require('path')
const { unlink, rename } = require('fs').promises
const rootPath = path.join(__dirname, '../../')
const uploadPath = path.join(rootPath, 'public')

const User = require('../models/User')

const jwt = require('jsonwebtoken')

const createUserToken = (id) => jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: '30d' })

const avatarFormats = ['jpg', 'jpeg', 'webp', 'gif', 'png']

const { newUser, updateUser } = require('../websocket')

module.exports = {
  async login(req, res) {
    const { email, password } = req.body
    let user = await User.findOne({ email }).select('+password')

    if(!user) {
      return res.status(404).json({
        error: 'E-mail não encontrado'
      })
    }

    if(await user.comparePassword(password)) {
      user.password = undefined
      return res.json({
        user,
        token: createUserToken(user._id)
      })
    }

    return res.status(401).json({
      error: 'Senha incorreta'
    })
  },
  async index(req, res) {
    const users = await User.find()

    return res.json(users)
  },
  async show(req, res) {
    const { user_id: id } = req.params

    try {
      let user = id ? await User.findById(id) : res.locals.user

      return res.json(user)
    } catch(err) {
      return res.status(404).json({
        error: 'Usuário não encontrado'
      })
    }
  },
  async store(req, res) {
    let { email, password, name, genre, age } = req.body

    if(!email || !password || !name) {
      return res.status(422).json({
        error: 'Dados insuficientes'
      })
    }

    let user = await User.findOne({ email })

    if(user) {
      return res.status(409).json({
        error: 'Email já cadastrado'
      })
    }

    try {
      user = await User.create({
        email,
        password,
        name,
        genre,
        age
      })
    } catch(error) {
      return res.status(500).json({ error })
    }

    newUser({
      ...user._doc,
      password: undefined
    })

    return res.status(201).json({
      ...user._doc,
      password: undefined
    })
  },
  async update(req, res) {
    const { user } = res.locals

    let newUser = await User.findByIdAndUpdate(user._id, req.body, {
      useFindAndModify: false,
      new: true
    })

    updateUser(newUser)

    return res.json(newUser)
  },
  async upload(req, res) {
    const { file } = req
    const { user } = res.locals

    let ext = file.originalname.split('.').pop()

    if(!ext || !avatarFormats.includes(ext)) {
      return res.status(422).json({
        error: 'Formato de imagem inválido'
      })
    }

    let oldPath = path.join(rootPath, file.path)
    let newPath = path.join(uploadPath, user._id.toString())

    try {
      await rename(oldPath, `${newPath}.${ext}`)

      user.photoUrl = `\/${user._id.toString()}.${ext}`
      await user.save()

      updateUser(user)

      return res.json(user)
    } catch(err) {
      await unlink(oldPath)

      return res.status(500).json({
        error: 'Ocorreu um erro'
      })
    }

  }
}
