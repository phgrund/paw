const jwt = require('jsonwebtoken')

const User = require('../models/User')

const createUserToken = (id) => jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: '30d' })

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
    let { email, password, name } = req.body

    if(!email || !password) {
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
        name
      })
    } catch(error) {
      return res.status(500).json({ error })
    }

    return res.status(201).json({
      ...user,
      password: undefined
    })
  },
  async update(req, res) {
    const { email, password, name } = req.body
    const { user } = req.locals

    user.save({
      email,
      password,
      name
    })

  }
}
