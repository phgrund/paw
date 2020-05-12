const { Router } = require('express')
const router = new Router()

router.get('/', (req, res) => res.json('123'))

module.exports = router