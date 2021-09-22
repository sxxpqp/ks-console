const Koa = require('koa')

const path = require('path')
// const koaBody = require('koa-body')

Koa.prototype.apply = function(module, ...rest) {
  module(this, ...rest)
  return this
}

global.MODE_DEV = process.env.NODE_ENV === 'development'
global.APP_ROOT = path.resolve(__dirname, '../')

const { getServerConfig } = require('./libs/utils')
const boot = require('./components/boot')
const locale = require('./components/locale')
// 日志
const logging = require('./components/logging')
const wsProxy = require('./components/wsProxy')
const errorProcess = require('./components/errorProcess')
const routes = require('./routes')

const { sequelize } = require('./services/sequelize')
const { initModels } = require('./models/init-models')
const { redisInit } = require('./services/redis-helper')
const { ftpsInit } = require('./services/ftps')
const { sshInit } = require('./services/ssh')

const app = new Koa()

const serverConfig = getServerConfig().server

global.HOSTNAME = serverConfig.http.hostname || 'localhost'
global.PORT = serverConfig.http.port || 8000

// 数据库初始化
const db = sequelize(serverConfig.db)
global.models = initModels(db)

// redis初始化
const redis = redisInit(serverConfig.redis)
global.redis = redis

// ftp初始化
const ftpOptions = serverConfig.ftp
global.ftpOptions = ftpOptions
global.ftp = ftpsInit(ftpOptions)
global.sshInit = sshInit(ftpOptions)
//  => {
//   res.execCommand('ls -la', { cwd: '/' }).then(function(result) {
//     console.log(`STDOUT: ${result.stdout}`)
//     console.log(`STDERR: ${result.stderr}`)
//   })
// })
// ftps.ls().exec(console.log)

app.keys = ['kubesphere->_<']

app
  .apply(boot)
  // 提供翻译
  .apply(locale)
  .apply(logging)
  .apply(errorProcess)
  // .use(
  //   koaBody({
  //     multipart: true,
  //     formidable: {
  //       keepExtensions: true,
  //       maxFieldsSize: 5 * 1024 * 1024,
  //     },
  //     onError: err => {
  //       // eslint-disable-next-line no-console
  //       console.log('koabody TCL: err', err)
  //     },
  //   })
  // )
  .use(routes.routes())

app.server = app.listen(global.PORT, err => {
  if (err) {
    return console.error(err)
  }
  /* eslint-disable no-console */
  console.log(`Dashboard app running at port ${global.PORT}`)
})

app.apply(wsProxy)
