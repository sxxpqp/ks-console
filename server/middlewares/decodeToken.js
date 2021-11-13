const jwtDecode = require('jwt-decode')
const { omit } = require('lodash')

module.exports = async (ctx, next) => {
  const token = ctx.cookies.get('token')
  if (token) {
    const { username } = jwtDecode(token)
    if (username) {
      const { users } = global.models
      // ctx.user = username
      const res = await users.findAll({
        where: {
          username,
        },
        raw: true,
      })
      if (res && res.length) {
        ctx.user = omit(res[0], 'password')
      }
    }
  }
  return await next()
}
