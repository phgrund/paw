const { Router } = require('express')
const router = new Router()

const auth = require('./middlewares/auth')

const UserController = require('./controllers/UserController')

router.post('/login', UserController.login)

router.get('/users', auth, UserController.index)
router.get('/user/:_id?', auth, UserController.show)
router.post('/user', UserController.store)

module.exports = router
