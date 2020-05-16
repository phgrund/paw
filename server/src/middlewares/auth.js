const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = (req, res, next) => {
  const { authorization } = req.headers
  if(!authorization) {
    return res.status(401).json({
      error: 'Usuário não está logado'
    })
  }

  let [_, token] = authorization.split(' ')

  if(!token) {
    return res.status(401).json({
      error: 'Sessão expirada, favor logar novamente'
    })
  }

  jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
    if(err)
      return res.status(401).json({
        error: 'Sessão expirada, favor logar novamente'
      })

    res.locals.user = await User.findById(decoded.id)

    return next()
  })
}
