const Message = require('../models/Message')

module.exports = {
  async index(req, res) {
    let { user_id: user } = req.params
    let query = {}
    user && (query.user = user)
    let messages = await Message.find(query).populate('user')//.sort('-createdAt')

    return res.json(messages)
  },
  async store(req, res) {
    let { content, anonymous } = req.body
    content = content.trim()
    if(!content) {
      return res.status(422).json({
        error: 'A mensagem não pode estar vazia'
      })
    }

    const { user } = res.locals

    let message = await Message.create({
      content,
      user: anonymous ? null : user._id
    })

    return res.status(201).json({
      ...message._doc,
      user: anonymous ? null : user
    })
  },
  async update(req, res) {
    let { id } = req.params
    let { content } = req.body
    let { user } = res.locals

    if(!content) {
      return res.json(422).json({
        error: 'A mensagem não pode estar vazia'
      })
    }

    let message = await Message.findById(id).populate('user')

    if(!message.user.equals(user._id)) {
      return res.status(403).json({
        error: 'Você não pode editar uma mensagem de outro usuário'
      })
    }

    message.content = content

    await message.save()

    return res.json(message)
  },
  async destroy(req, res) {
    let { id } = req.params
    let { user } = res.locals

    let message = await Message.findById(id).populate('user')

    if(!message.user.equals(user._id)) {
      return res.status(403).json({
        error: 'Você não pode excluir uma mensagem de outro usuário'
      })
    }

    await message.remove()

    return res.json({
      message: 'Mensagem deletada com sucesso.'
    })
  }
}
