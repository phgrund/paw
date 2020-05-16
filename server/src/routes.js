const { Router } = require('express')
const router = new Router()

const auth = require('./middlewares/auth')

const UserController = require('./controllers/UserController')
const MessageController = require('./controllers/MessageController')

// Autenticação
router.post('/login', UserController.login)

// Usuário
router.get('/users', auth, UserController.index)
router.get('/user/:user_id?', auth, UserController.show)
router.post('/user', UserController.store)

// Mensagens
router.get('/messages', auth, MessageController.index)
router.get('/messages/:user_id', auth, MessageController.index)
router.post('/message', auth, MessageController.store)
router.put('/message/:id', auth, MessageController.update)
router.delete('/message/:id', auth, MessageController.destroy)

module.exports = router
